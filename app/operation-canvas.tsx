"use client";

import {
  addEdge,
  Background,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Connection,
  type EdgeProps,
  type NodeProps,
} from "@xyflow/react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  drawingHash,
  executableOrder,
  generateOperationDrawing,
  type EdgeChannel,
  type IntegrationReceipt,
  type OperationColor,
  type OperationData,
  type OperationEdge,
  type OperationMode,
  type OperationNode,
  type OperationRun,
  type OperationStatus,
  type RunEvent,
} from "./operation-model";

type OperationCanvasProps = {
  context: string;
  onClose: () => void;
  operationKey: string;
};

const STORAGE_PREFIX = "from-to-chat:operation-canvas:v1";
const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const kindMeta: Record<OperationData["kind"], { icon: string; label: string }> = {
  context: { icon: "◎", label: "Context" },
  "agent-task": { icon: "✦", label: "Agent task" },
  git: { icon: "⌁", label: "Git operation" },
  command: { icon: "›_", label: "Command" },
  check: { icon: "✓", label: "Check" },
  review: { icon: "◫", label: "Human review" },
  final: { icon: "◆", label: "Canonical action" },
};

const channelColors: Record<EdgeChannel, string> = {
  dependency: "#8a918b",
  request: "#9c8bd7",
  result: "#6fb58c",
  artifact: "#d7a75e",
  approval: "#76c99a",
  context: "#73a8d2",
  feedback: "#d17b75",
};

const OperationNodeCard = memo(function OperationNodeCard({ id, data, selected }: NodeProps<OperationNode>) {
  const meta = kindMeta[data.kind];
  const statusLabel = data.status.replace("-", " ");
  return (
    <div className={`operation-node color-${data.color ?? "slate"} status-${data.status} ${selected ? "selected" : ""}`}>
      <Handle className="operation-handle" id="in" position={Position.Left} type="target" />
      <Handle className="operation-handle operation-handle-back" id="back-out" position={Position.Left} type="source" />
      <div className="operation-node-topline">
        <span className="operation-kind-icon" aria-hidden="true">{meta.icon}</span>
        <span>{meta.label}</span>
      </div>
      <strong className="operation-node-identifier">{id}</strong>
      <span className="operation-node-title">{data.title}</span>
      <p>{data.instruction}</p>
      <div className="operation-node-footer">
        <span>{data.actor}</span>
        <span className="operation-node-status"><i className={`operation-status-dot ${data.status}`} />{statusLabel}</span>
      </div>
      {data.evidence && <div className="operation-evidence">{data.evidence}</div>}
      <Handle className="operation-handle" id="out" position={Position.Right} type="source" />
      <Handle className="operation-handle operation-handle-back" id="back-in" position={Position.Right} type="target" />
    </div>
  );
});

const OperationConnection = memo(function OperationConnection({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  markerStart,
  data,
  selected,
}: EdgeProps<OperationEdge>) {
  const offset = Number(data?.offset ?? 0);
  const direction = targetX >= sourceX ? 1 : -1;
  const control = Math.max(80, Math.abs(targetX - sourceX) * 0.42);
  const path = [
    `M ${sourceX} ${sourceY}`,
    `C ${sourceX + control * direction} ${sourceY + offset},`,
    `${targetX - control * direction} ${targetY + offset},`,
    `${targetX} ${targetY}`,
  ].join(" ");
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2 + offset * 0.72;
  const color = selected ? "#65707d" : "#aeb6c0";

  return (
    <>
      <BaseEdge
        id={id}
        markerEnd={markerEnd}
        markerStart={markerStart}
        path={path}
        style={{
          stroke: color,
          strokeWidth: selected ? 2.6 : 1.6,
          strokeDasharray: data?.execution ? undefined : "5 4",
        }}
      />
      <EdgeLabelRenderer>
        <span
          className={`operation-edge-label ${selected ? "selected" : ""}`}
          style={{
            borderColor: color,
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {data?.label}
        </span>
      </EdgeLabelRenderer>
    </>
  );
});

const nodeTypes = { operation: OperationNodeCard };
const edgeTypes = { operation: OperationConnection };

function nowLabel() {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function OperationCanvasInner({ context, onClose, operationKey }: OperationCanvasProps) {
  const initial = useMemo(() => generateOperationDrawing("integration", context), [context]);
  const [mode, setMode] = useState<OperationMode>("integration");
  const [nodes, setNodes, onNodesChange] = useNodesState<OperationNode>(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<OperationEdge>(initial.edges);
  const [revision, setRevision] = useState(1);
  const [generationNote, setGenerationNote] = useState(initial.note);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [runs, setRuns] = useState<OperationRun[]>([]);
  const [running, setRunning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<IntegrationReceipt | null>(null);
  const [historyOpen, setHistoryOpen] = useState(true);
  const hydratedRef = useRef(false);
  const runTokenRef = useRef(0);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);
  const latestRun = runs[0];
  const storageKey = `${STORAGE_PREFIX}:${operationKey}`;
  const currentHash = drawingHash(revision, nodes, edges);
  const candidateReady =
    latestRun?.status === "succeeded" &&
    latestRun.revision === revision &&
    latestRun.hash === currentHash &&
    Boolean(latestRun.candidateCommit);
  const canReviseFailure =
    latestRun?.status === "failed" &&
    latestRun.revision === revision &&
    nodes.some((node) => node.data.status === "failed");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const value = JSON.parse(stored) as {
            mode: OperationMode;
            nodes: OperationNode[];
            edges: OperationEdge[];
            revision: number;
            runs: OperationRun[];
            receipt: IntegrationReceipt | null;
            generationNote?: string;
          };
          setMode(value.mode);
          setNodes(value.nodes);
          setEdges(value.edges);
          setRevision(value.revision);
          setRuns(value.runs ?? []);
          setReceipt(value.receipt ?? null);
          if (value.generationNote) setGenerationNote(value.generationNote);
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        hydratedRef.current = true;
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [setEdges, setNodes, storageKey]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ mode, nodes, edges, revision, runs, receipt, generationNote }),
    );
  }, [edges, generationNote, mode, nodes, receipt, revision, runs, storageKey]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !running) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, running]);

  useEffect(() => () => {
    runTokenRef.current += 1;
  }, []);

  const markDrawingChanged = useCallback(() => {
    setRevision((current) => current + 1);
    setReceipt(null);
    setValidationError(null);
    setNodes((current) => current.map((node) => ({
      ...node,
      data: { ...node.data, status: "proposed", evidence: undefined },
    })));
  }, [setNodes]);

  const regenerate = useCallback((nextMode: OperationMode = mode) => {
    const generated = generateOperationDrawing(nextMode, context);
    runTokenRef.current += 1;
    setRunning(false);
    setMode(nextMode);
    setNodes(generated.nodes);
    setEdges(generated.edges);
    setGenerationNote(generated.note);
    setRevision((current) => current + 1);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setValidationError(null);
    setReceipt(null);
  }, [context, mode, setEdges, setNodes]);

  const updateNodeData = useCallback((patch: Partial<OperationData>) => {
    if (!selectedNodeId) return;
    setNodes((current) => current.map((node) =>
      node.id === selectedNodeId
        ? { ...node, data: { ...node.data, ...patch } }
        : node
    ));
    markDrawingChanged();
  }, [markDrawingChanged, selectedNodeId, setNodes]);

  const updateEdgeData = useCallback((patch: Partial<OperationEdge["data"]>) => {
    if (!selectedEdgeId) return;
    setEdges((current) => current.map((item) =>
      item.id === selectedEdgeId
        ? { ...item, data: { ...item.data!, ...patch } }
        : item
    ));
    markDrawingChanged();
  }, [markDrawingChanged, selectedEdgeId, setEdges]);

  const onConnect = useCallback((connection: Connection) => {
    const id = `edge-${Date.now()}`;
    setEdges((current) => addEdge<OperationEdge>({
      ...connection,
      id,
      type: "operation",
      data: {
        channel: "dependency",
        label: "depends on",
        execution: true,
      },
    }, current));
    markDrawingChanged();
  }, [markDrawingChanged, setEdges]);

  const addOperation = useCallback(() => {
    const id = `operation-${Date.now()}`;
    setNodes((current) => [
      ...current,
      {
        id,
        type: "operation",
        position: { x: 380 + current.length * 24, y: 460 + (current.length % 3) * 45 },
        data: {
          title: "New operation",
          instruction: "Describe what the agent or platform should accomplish.",
          kind: "agent-task",
          actor: "agent",
          status: "proposed",
        },
      },
    ]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
    markDrawingChanged();
  }, [markDrawingChanged, setNodes]);

  const deleteSelection = useCallback(() => {
    if (selectedNodeId) {
      setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
      setEdges((current) => current.filter(
        (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId,
      ));
      setSelectedNodeId(null);
      markDrawingChanged();
      return;
    }
    if (selectedEdgeId) {
      setEdges((current) => current.filter((edge) => edge.id !== selectedEdgeId));
      setSelectedEdgeId(null);
      markDrawingChanged();
    }
  }, [markDrawingChanged, selectedEdgeId, selectedNodeId, setEdges, setNodes]);

  const reviseAfterFailure = useCallback(() => {
    const failed = nodes.find((node) => node.data.status === "failed");
    if (!failed) return;
    const fixId = `repair-${Date.now()}`;
    const repair: OperationNode = {
      id: fixId,
      type: "operation",
      position: { x: failed.position.x - 20, y: failed.position.y + 250 },
      data: {
        title: `Repair ${failed.data.title.toLowerCase()}`,
        instruction: "Inspect the failed evidence, make a focused correction, and preserve unrelated work.",
        kind: "agent-task",
        actor: "agent",
        status: "proposed",
      },
    };
    const incoming = edges.filter((item) => item.target === failed.id && item.data?.execution);
    const incomingIds = new Set(incoming.map((item) => item.id));
    const rerouted = edges.map((item) =>
      incomingIds.has(item.id) ? { ...item, target: fixId } : item
    );
    rerouted.push({
      id: `repair-edge-${Date.now()}`,
      type: "operation",
      source: fixId,
      target: failed.id,
      sourceHandle: "out",
      targetHandle: "in",
      data: {
        channel: "dependency",
        label: "retry",
        execution: true,
      },
    });
    setNodes((current) => [
      ...current.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: "proposed" as OperationStatus,
          evidence: undefined,
          failNext: node.id === failed.id ? false : node.data.failNext,
        },
      })),
      repair,
    ]);
    setEdges(rerouted);
    setRevision((current) => current + 1);
    setGenerationNote(`Pi revised the drawing around “${failed.data.title}” using its failed run evidence.`);
    setValidationError(null);
    setSelectedNodeId(fixId);
    setSelectedEdgeId(null);
  }, [edges, nodes, setEdges, setNodes]);

  const runDrawing = useCallback(async () => {
    if (running) return;
    const validation = executableOrder(nodes, edges);
    const finalNodes = nodes.filter((node) => node.data.kind === "final");
    if (validation.error) {
      setValidationError(validation.error);
      return;
    }
    if (finalNodes.length !== 1) {
      setValidationError("The drawing needs exactly one canonical final action.");
      return;
    }

    const token = runTokenRef.current + 1;
    runTokenRef.current = token;
    const runId = `run-${Date.now()}`;
    const hash = drawingHash(revision, nodes, edges);
    const startedAt = nowLabel();
    const events: RunEvent[] = [{
      id: `${runId}-start`,
      level: "info",
      message: `Frozen drawing r${revision} as ${hash}. Started a separate ${mode} Sandbox.`,
      at: startedAt,
    }];
    const run: OperationRun = {
      id: runId,
      revision,
      hash,
      status: "running",
      startedAt,
      events,
    };

    const updateRun = (patch: Partial<OperationRun>) => {
      setRuns((current) => current.map((item) =>
        item.id === runId ? { ...item, ...patch, events: [...events] } : item
      ));
    };
    const addEvent = (
      level: RunEvent["level"],
      message: string,
      nodeId?: string,
    ) => {
      events.push({
        id: `${runId}-${events.length}`,
        nodeId,
        level,
        message,
        at: nowLabel(),
      });
      updateRun({});
    };
    const setNodeStatus = (
      nodeId: string,
      status: OperationStatus,
      evidence?: string,
    ) => {
      setNodes((current) => current.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, status, evidence } }
          : node
      ));
    };

    setReceipt(null);
    setValidationError(null);
    setRunning(true);
    setRuns((current) => [run, ...current]);
    setNodes((current) => current.map((node) => ({
      ...node,
      data: { ...node.data, status: "queued", evidence: undefined },
    })));

    for (const nodeId of validation.order) {
      if (runTokenRef.current !== token) return;
      const node = nodes.find((item) => item.id === nodeId);
      if (!node) continue;
      if (node.data.kind === "final") {
        setNodeStatus(node.id, "awaiting-approval", "Candidate is isolated; canonical artifact is unchanged.");
        continue;
      }
      setNodeStatus(node.id, "running");
      addEvent("info", `Running ${node.data.title}`, node.id);
      await wait(node.data.kind === "check" ? 720 : 430);
      if (runTokenRef.current !== token) return;
      if (node.data.failNext) {
        const evidence = node.data.kind === "check"
          ? "2 focused checks failed · candidate remains isolated"
          : "Operation returned a recoverable error";
        setNodeStatus(node.id, "failed", evidence);
        addEvent("error", `${node.data.title} failed: ${evidence}.`, node.id);
        updateRun({ status: "failed", completedAt: nowLabel() });
        setRunning(false);
        return;
      }
      const evidence = node.data.kind === "check"
        ? "12 checks passed · build completed"
        : node.data.kind === "git"
          ? "Checkout and expected heads verified"
          : "Completed with evidence attached";
      setNodeStatus(node.id, "passed", evidence);
      addEvent("success", `${node.data.title}: ${evidence}.`, node.id);
    }

    const candidateCommit = `${mode === "integration" ? "int" : "set"}-${hash.slice(0, 7)}`;
    addEvent("success", `Candidate ${candidateCommit} is ready for human approval.`);
    updateRun({
      status: "succeeded",
      candidateCommit,
      completedAt: nowLabel(),
    });
    setRunning(false);
  }, [edges, mode, nodes, revision, running, setNodes]);

  const approveCandidate = useCallback(() => {
    if (!latestRun?.candidateCommit || latestRun.status !== "succeeded") return;
    const finalNode = nodes.find((node) => node.data.kind === "final");
    if (finalNode) {
      setNodes((current) => current.map((node) =>
        node.id === finalNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                status: "passed",
                evidence: `${latestRun.candidateCommit} became canonical by compare-and-swap.`,
              },
            }
          : node
      ));
    }
    const approvedAt = nowLabel();
    setRuns((current) => current.map((run) =>
      run.id === latestRun.id
        ? {
            ...run,
            status: "approved",
            events: [
              ...run.events,
              {
                id: `${run.id}-approval`,
                level: "success",
                message: `Human approved ${run.candidateCommit}; canonical artifact advanced atomically.`,
                at: approvedAt,
              },
            ],
          }
        : run
    ));
    setReceipt({
      id: `receipt-${Date.now()}`,
      operation: mode,
      drawingRevision: latestRun.revision,
      drawingHash: latestRun.hash,
      candidateCommit: latestRun.candidateCommit,
      destinationBefore: mode === "integration" ? "a-41d82af" : "unprovisioned",
      destinationAfter: latestRun.candidateCommit,
      approvedAt,
      approvedBy: "Local reviewer",
    });
  }, [latestRun, mode, nodes, setNodes]);

  const resetLocalState = useCallback(() => {
    window.localStorage.removeItem(storageKey);
    setRuns([]);
    regenerate(mode);
  }, [mode, regenerate, storageKey]);

  return (
    <section className="operation-workspace" aria-label="Agent operation drawing">
      <header className="operation-header">
        <div className="operation-heading">
          <span className="operation-agent-avatar" aria-hidden="true">π</span>
          <div>
            <div className="operation-title-row">
              <h2>{mode === "integration" ? "Integrate node B into A" : "Set up this node"}</h2>
              <span className="local-simulation-pill">Local simulator</span>
            </div>
            <p>Pi generated drawing · revision {revision} · source and destination nodes continue independently</p>
          </div>
        </div>
        <div className="operation-header-actions">
          <div className="mode-switcher" role="group" aria-label="Operation type">
            <button className={mode === "integration" ? "active" : ""} onClick={() => regenerate("integration")} disabled={running} type="button">Integration</button>
            <button className={mode === "setup" ? "active" : ""} onClick={() => regenerate("setup")} disabled={running} type="button">Setup</button>
          </div>
          <button className="operation-close" onClick={onClose} disabled={running} aria-label="Close operation drawing" type="button">×</button>
        </div>
      </header>

      <div className="operation-toolbar">
        <div className="operation-agent-note"><span>✦</span>{generationNote}</div>
        <div className="operation-toolbar-actions">
          <button onClick={addOperation} disabled={running} type="button">＋ Add operation</button>
          <button onClick={() => regenerate()} disabled={running} type="button">↻ Redraw from context</button>
          {(selectedNode || selectedEdge) && <button className="danger-subtle" onClick={deleteSelection} disabled={running} type="button">Delete selected</button>}
          <button className="run-drawing-button" onClick={runDrawing} disabled={running} type="button">
            {running ? <><i className="button-spinner" /> Running revision {revision}</> : "▶ Run in sandbox"}
          </button>
          <button className="approve-drawing-button" onClick={approveCandidate} disabled={!candidateReady || running} type="button">
            {mode === "integration" ? "Approve integration" : "Approve setup"}
          </button>
        </div>
      </div>

      {validationError && <div className="operation-alert error"><strong>Drawing cannot run.</strong> {validationError}</div>}
      {receipt && (
        <div className="operation-alert success">
          <strong>{mode === "integration" ? "Integration complete." : "Node setup complete."}</strong>
          {" "}Receipt {receipt.id} binds drawing r{receipt.drawingRevision} to <code>{receipt.candidateCommit}</code>.
        </div>
      )}

      <div className={`operation-body ${historyOpen ? "" : "history-collapsed"}`}>
        <div className="operation-canvas">
          <ReactFlow<OperationNode, OperationEdge>
            colorMode="light"
            defaultEdgeOptions={{
              markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
            }}
            deleteKeyCode={null}
            edgeTypes={edgeTypes}
            edges={edges}
            fitView
            fitViewOptions={{ padding: 0.16, maxZoom: 1 }}
            minZoom={0.28}
            nodeTypes={nodeTypes}
            nodes={nodes}
            nodesConnectable={!running}
            nodesDraggable={!running}
            onConnect={onConnect}
            onEdgeClick={(_, edge) => {
              setSelectedEdgeId(edge.id);
              setSelectedNodeId(null);
            }}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => {
              setSelectedNodeId(node.id);
              setSelectedEdgeId(null);
            }}
            onNodeDragStop={markDrawingChanged}
            onNodesChange={onNodesChange}
            onPaneClick={() => {
              setSelectedNodeId(null);
              setSelectedEdgeId(null);
            }}
          >
            <Background color="#d9dee4" gap={24} size={1} />
            <MiniMap
              className="operation-minimap"
              maskColor="rgba(18, 20, 19, .72)"
              nodeColor={(node) => {
                const status = (node.data as OperationData).status;
                return status === "failed" ? "#d57973" : status === "passed" ? "#65b887" : "#9aa5b2";
              }}
              pannable
              zoomable
            />
            <Controls className="operation-flow-controls" showInteractive={false} />
          </ReactFlow>
          <div className="operation-canvas-legend">
            {(["dependency", "artifact", "result", "feedback", "approval"] as EdgeChannel[]).map((channel) => (
              <span key={channel}><i style={{ background: channelColors[channel] }} />{channel}</span>
            ))}
          </div>
        </div>

        <aside className="operation-inspector" aria-label="Drawing inspector">
          {selectedNode ? (
            <>
              <div className="inspector-heading">
                <span>{kindMeta[selectedNode.data.kind].icon}</span>
                <div><strong>Operation</strong><small>{selectedNode.id}</small></div>
              </div>
              <label>
                Title
                <input value={selectedNode.data.title} disabled={running} onChange={(event) => updateNodeData({ title: event.target.value })} />
              </label>
              <label>
                Instruction
                <textarea value={selectedNode.data.instruction} disabled={running} onChange={(event) => updateNodeData({ instruction: event.target.value })} rows={5} />
              </label>
              <label>
                Color
                <div className="operation-color-options" role="group" aria-label="Node color">
                  {(["slate", "blue", "mint", "amber", "violet", "rose"] as OperationColor[]).map((color) => (
                    <button
                      aria-label={`Use ${color} color`}
                      className={`color-option color-${color} ${(selectedNode.data.color ?? "slate") === color ? "active" : ""}`}
                      disabled={running}
                      key={color}
                      onClick={() => updateNodeData({ color })}
                      type="button"
                    />
                  ))}
                </div>
              </label>
              <label>
                Type
                <select value={selectedNode.data.kind} disabled={running} onChange={(event) => updateNodeData({ kind: event.target.value as OperationData["kind"] })}>
                  {Object.entries(kindMeta).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}
                </select>
              </label>
              <label className="inspector-checkbox">
                <input
                  checked={Boolean(selectedNode.data.failNext)}
                  disabled={running}
                  onChange={(event) => updateNodeData({ failNext: event.target.checked })}
                  type="checkbox"
                />
                Simulate failure on next run
              </label>
              {selectedNode.data.evidence && (
                <div className="inspector-evidence">
                  <strong>Latest evidence</strong>
                  <p>{selectedNode.data.evidence}</p>
                </div>
              )}
            </>
          ) : selectedEdge ? (
            <>
              <div className="inspector-heading">
                <span>↝</span>
                <div><strong>Connection</strong><small>{selectedEdge.source} → {selectedEdge.target}</small></div>
              </div>
              <label>
                Label
                <input value={selectedEdge.data?.label ?? ""} disabled={running} onChange={(event) => updateEdgeData({ label: event.target.value })} />
              </label>
              <label>
                Channel
                <select value={selectedEdge.data?.channel} disabled={running} onChange={(event) => updateEdgeData({ channel: event.target.value as EdgeChannel })}>
                  {Object.keys(channelColors).map((channel) => <option key={channel} value={channel}>{channel}</option>)}
                </select>
              </label>
              <label className="inspector-checkbox">
                <input
                  checked={Boolean(selectedEdge.data?.execution)}
                  disabled={running}
                  onChange={(event) => updateEdgeData({ execution: event.target.checked })}
                  type="checkbox"
                />
                Controls execution order
              </label>
              <p className="inspector-help">Dashed edges carry information or feedback without creating an execution dependency. Multiple edges between the same operations remain independent.</p>
            </>
          ) : (
            <div className="inspector-empty">
              <span aria-hidden="true">⌁</span>
              <strong>Shape the agent’s approach</strong>
              <p>Select an operation or connection to edit it. Drag from a node’s right handle to another node to add a dependency.</p>
              <div className="inspector-tip"><b>Dual edges are active.</b> The generated drawing includes parallel artifact/result edges and a reciprocal feedback edge.</div>
            </div>
          )}
        </aside>

        <aside className="run-history" aria-label="Sandbox run history">
          <button className="history-heading" onClick={() => setHistoryOpen((current) => !current)} type="button">
            <span><strong>Sandbox evidence</strong><small>{runs.length} immutable {runs.length === 1 ? "run" : "runs"}</small></span>
            <i>{historyOpen ? "›" : "‹"}</i>
          </button>
          {historyOpen && (
            <div className="history-content">
              {!runs.length && (
                <div className="history-empty">
                  <span>›_</span>
                  <p>Run the drawing to freeze a revision and stream local Sandbox evidence here.</p>
                </div>
              )}
              {canReviseFailure && (
                <button className="agent-revise-button" onClick={reviseAfterFailure} disabled={running} type="button">
                  <span>✦</span>
                  <span><strong>Ask Pi to revise drawing</strong><small>Add a repair path from the failed evidence</small></span>
                </button>
              )}
              {runs.map((run) => (
                <details className={`run-card ${run.status}`} key={run.id} open={run.id === latestRun?.id}>
                  <summary>
                    <span className={`run-status-icon ${run.status}`}>{run.status === "running" ? "…" : run.status === "failed" ? "!" : "✓"}</span>
                    <span><strong>Revision {run.revision}</strong><small>{run.hash} · {run.startedAt}</small></span>
                    <em>{run.status}</em>
                  </summary>
                  <div className="run-events">
                    {run.events.map((event) => (
                      <div className={event.level} key={event.id}>
                        <time>{event.at}</time>
                        <p>{event.message}</p>
                      </div>
                    ))}
                  </div>
                  {run.candidateCommit && <div className="candidate-ref"><span>Candidate</span><code>{run.candidateCommit}</code></div>}
                </details>
              ))}
              {runs.length > 0 && <button className="reset-prototype" onClick={resetLocalState} disabled={running} type="button">Reset local prototype</button>}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default function OperationCanvas(props: OperationCanvasProps) {
  return (
    <ReactFlowProvider>
      <OperationCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
