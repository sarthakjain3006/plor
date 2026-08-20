import type { Edge, Node, XYPosition } from "@xyflow/react";

export type OperationKind =
  | "context"
  | "agent-task"
  | "git"
  | "command"
  | "check"
  | "review"
  | "final";

export type OperationColor = "slate" | "blue" | "mint" | "amber" | "violet" | "rose";

export type OperationStatus =
  | "proposed"
  | "queued"
  | "running"
  | "passed"
  | "failed"
  | "awaiting-approval";

export type EdgeChannel =
  | "dependency"
  | "request"
  | "result"
  | "artifact"
  | "approval"
  | "context"
  | "feedback";

export type OperationData = {
  [key: string]: unknown;
  title: string;
  instruction: string;
  kind: OperationKind;
  status: OperationStatus;
  actor: "agent" | "platform" | "human";
  color?: OperationColor;
  evidence?: string;
  failNext?: boolean;
};

export type OperationEdgeData = {
  [key: string]: unknown;
  channel: EdgeChannel;
  label: string;
  offset?: number;
  execution: boolean;
};

export type OperationNode = Node<OperationData, "operation">;
export type OperationEdge = Edge<OperationEdgeData, "operation">;
export type OperationMode = "integration" | "setup";

export type RunEvent = {
  id: string;
  nodeId?: string;
  level: "info" | "success" | "error";
  message: string;
  at: string;
};

export type OperationRun = {
  id: string;
  revision: number;
  hash: string;
  status: "running" | "failed" | "succeeded" | "approved";
  startedAt: string;
  completedAt?: string;
  candidateCommit?: string;
  events: RunEvent[];
};

export type IntegrationReceipt = {
  id: string;
  operation: OperationMode;
  drawingRevision: number;
  drawingHash: string;
  candidateCommit: string;
  destinationBefore: string;
  destinationAfter: string;
  approvedAt: string;
  approvedBy: string;
};

function operation(
  id: string,
  position: XYPosition,
  title: string,
  instruction: string,
  kind: OperationKind,
  actor: OperationData["actor"] = "agent",
  failNext = false,
  color: OperationData["color"] = "slate",
): OperationNode {
  return {
    id,
    type: "operation",
    position,
    data: {
      title,
      instruction,
      kind,
      actor,
      color,
      status: "proposed",
      failNext,
    },
  };
}

function edge(
  id: string,
  source: string,
  target: string,
  channel: EdgeChannel,
  label: string,
  options: {
    execution?: boolean;
    offset?: number;
    sourceHandle?: string;
    targetHandle?: string;
  } = {},
): OperationEdge {
  return {
    id,
    type: "operation",
    source,
    target,
    sourceHandle: options.sourceHandle ?? "out",
    targetHandle: options.targetHandle ?? "in",
    data: {
      channel,
      label,
      execution: options.execution ?? channel === "dependency",
      offset: options.offset,
    },
  };
}

export function generateOperationDrawing(
  mode: OperationMode,
  context: string,
): { nodes: OperationNode[]; edges: OperationEdge[]; note: string } {
  const shortContext = context.trim().replace(/\s+/g, " ").slice(0, 86);

  if (mode === "setup") {
    return {
      note: `Generated from the active node context: “${shortContext}”`,
      nodes: [
        operation("context", { x: 40, y: 190 }, "Read node context", shortContext, "context"),
        operation("clone", { x: 330, y: 70 }, "Clone artifact", "Create an isolated checkout at the recorded source head.", "git", "platform"),
        operation("inspect", { x: 330, y: 300 }, "Inspect project", "Identify runtimes, package managers, setup files, and existing guidance.", "agent-task"),
        operation("environment", { x: 650, y: 70 }, "Create environment", "Install dependencies and prepare the node-local development environment.", "command"),
        operation("node-context", { x: 650, y: 300 }, "Create working context", "Summarize the repository, objective, constraints, and useful commands.", "agent-task"),
        operation("health", { x: 970, y: 185 }, "Run health check", "Run the discovered build and focused tests in the Sandbox.", "check", "agent", true),
        operation("review", { x: 1280, y: 185 }, "Review setup evidence", "Present environment details, changed files, checks, and unresolved risks.", "review", "human"),
        operation("activate", { x: 1580, y: 185 }, "Activate node", "Make the proven candidate the node’s canonical starting artifact.", "final", "platform"),
      ],
      edges: [
        edge("context-clone", "context", "clone", "dependency", "repository"),
        edge("context-inspect", "context", "inspect", "dependency", "objective"),
        edge("clone-environment", "clone", "environment", "dependency", "checkout"),
        edge("inspect-environment", "inspect", "environment", "dependency", "setup facts"),
        edge("inspect-node-context", "inspect", "node-context", "dependency", "findings"),
        edge("environment-health", "environment", "health", "dependency", "runtime"),
        edge("node-context-health", "node-context", "health", "dependency", "commands"),
        edge("health-review-artifact", "health", "review", "artifact", "evidence", { execution: true, offset: -18 }),
        edge("health-review-result", "health", "review", "result", "check result", { execution: false, offset: 18 }),
        edge("review-health-feedback", "review", "health", "feedback", "changes requested", {
          execution: false,
          offset: 42,
          sourceHandle: "back-out",
          targetHandle: "back-in",
        }),
        edge("review-activate", "review", "activate", "approval", "human approval", { execution: true }),
      ],
    };
  }

  return {
    note: `Generated from the active node context: “${shortContext}”`,
    nodes: [
      operation("context", { x: 30, y: 190 }, "Read integration context", shortContext, "context"),
      operation("source", { x: 330, y: 55 }, "Fetch source B", "Capture B’s submitted head without changing B’s active Sandbox.", "git", "platform"),
      operation("destination", { x: 330, y: 325 }, "Fetch destination A", "Capture A’s expected head without changing A’s active Sandbox.", "git", "platform"),
      operation("strategy", { x: 650, y: 190 }, "Choose integration strategy", "Inspect lineage and propose merge, rebase, or selected commits.", "agent-task"),
      operation("candidate", { x: 970, y: 190 }, "Prepare candidate ref", "Apply the proposed strategy on an isolated integration checkout.", "git"),
      operation("checks", { x: 1270, y: 70 }, "Run focused checks", "Build and test the combined candidate in the Sandbox.", "check", "agent", true),
      operation("summary", { x: 1270, y: 315 }, "Prepare handoff", "Summarize code, decisions, conflicts, and knowledge returning to A.", "agent-task"),
      operation("review", { x: 1570, y: 190 }, "Review candidate", "Inspect the candidate diff and evidence before authorizing integration.", "review", "human"),
      operation("integrate", { x: 1880, y: 190 }, "Integrate into A", "Compare-and-swap A’s canonical artifact to the approved candidate.", "final", "platform"),
    ],
    edges: [
      edge("context-source", "context", "source", "context", "source scope", { execution: true }),
      edge("context-destination", "context", "destination", "context", "target scope", { execution: true }),
      edge("source-strategy", "source", "strategy", "dependency", "source head"),
      edge("destination-strategy", "destination", "strategy", "dependency", "destination head"),
      edge("strategy-candidate", "strategy", "candidate", "request", "approved approach", { execution: true }),
      edge("candidate-checks", "candidate", "checks", "dependency", "candidate"),
      edge("candidate-summary", "candidate", "summary", "dependency", "changes"),
      edge("checks-review", "checks", "review", "result", "checks", { execution: true, offset: -20 }),
      edge("summary-review", "summary", "review", "context", "handoff", { execution: true }),
      edge("candidate-review-artifact", "candidate", "review", "artifact", "candidate diff", { execution: false, offset: 24 }),
      edge("candidate-review-result", "candidate", "review", "result", "candidate status", { execution: false, offset: 48 }),
      edge("review-candidate-feedback", "review", "candidate", "feedback", "changes requested", {
        execution: false,
        offset: 72,
        sourceHandle: "back-out",
        targetHandle: "back-in",
      }),
      edge("review-integrate", "review", "integrate", "approval", "human approval", { execution: true }),
    ],
  };
}

export function executableOrder(nodes: OperationNode[], edges: OperationEdge[]) {
  const executableEdges = edges.filter((item) => item.data?.execution);
  const nodeIds = new Set(nodes.map((node) => node.id));
  const indegree = new Map(nodes.map((node) => [node.id, 0]));
  const outgoing = new Map(nodes.map((node) => [node.id, [] as string[]]));

  for (const item of executableEdges) {
    if (!nodeIds.has(item.source) || !nodeIds.has(item.target)) continue;
    indegree.set(item.target, (indegree.get(item.target) ?? 0) + 1);
    outgoing.get(item.source)?.push(item.target);
  }

  const queue = nodes.filter((node) => indegree.get(node.id) === 0).map((node) => node.id);
  const ordered: string[] = [];
  while (queue.length) {
    const id = queue.shift();
    if (!id) continue;
    ordered.push(id);
    for (const target of outgoing.get(id) ?? []) {
      const next = (indegree.get(target) ?? 0) - 1;
      indegree.set(target, next);
      if (next === 0) queue.push(target);
    }
  }

  return ordered.length === nodes.length
    ? { order: ordered, error: null }
    : { order: ordered, error: "The executable connections contain a cycle." };
}

export function drawingHash(revision: number, nodes: OperationNode[], edges: OperationEdge[]) {
  const source = JSON.stringify({
    revision,
    nodes: nodes.map(({ id, data }) => ({ id, title: data.title, instruction: data.instruction, kind: data.kind })),
    edges: edges.map(({ source, target, data }) => ({ source, target, channel: data?.channel, execution: data?.execution })),
  });
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0).toString(16).padStart(8, "0");
}
