"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type {
  ConversationLayer,
  LayerId,
  MessagesById,
} from "./conversation-model";
import { layoutLayers } from "./graph-layout";
import WebGLGraph, { type WebGLGraphHandle } from "./webgl-graph";

type ConversationOverviewProps = {
  currentLayerId: LayerId;
  layerPath: LayerId[];
  layers: ConversationLayer[];
  messagesById: MessagesById;
  onClose: () => void;
  onNavigate: (layerId: LayerId) => void;
};

export default function ConversationOverview({
  currentLayerId,
  layerPath,
  layers,
  messagesById,
  onClose,
  onNavigate,
}: ConversationOverviewProps) {
  const graphRef = useRef<WebGLGraphHandle>(null);
  const zoomOutputRef = useRef<HTMLOutputElement>(null);
  const graph = useMemo(() => layoutLayers(layers), [layers]);
  const activeLayerIds = useMemo(() => new Set(layerPath), [layerPath]);

  const updateScaleOutput = useCallback((scale: number) => {
    if (zoomOutputRef.current) {
      zoomOutputRef.current.value = `${Math.round(scale * 100)}%`;
    }
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <section className="overview" aria-label="Conversation overview">
      <header className="overview-header">
        <div>
          <h2>Conversation map</h2>
          <p>{layers.length} layers · highlighted path leads to the current page</p>
        </div>
        <button className="overview-close" onClick={onClose} aria-label="Close overview" type="button">×</button>
      </header>
      <div className="graph-scroll">
        <WebGLGraph
          activeLayerIds={activeLayerIds}
          currentLayerId={currentLayerId}
          graph={graph}
          messagesById={messagesById}
          onNavigate={onNavigate}
          onScaleChange={updateScaleOutput}
          ref={graphRef}
        />
        <div className="graph-a11y-list">
          {graph.nodes.map((node) => (
            <button key={node.id} onClick={() => onNavigate(node.id)} type="button">
              Open {node.depth === 0 ? "root conversation" : `layer ${node.depth}`}
            </button>
          ))}
        </div>
        <div className="canvas-controls" aria-label="Canvas zoom controls">
          <button onClick={() => graphRef.current?.zoomBy(-.15)} aria-label="Zoom out" title="Zoom out" type="button">−</button>
          <output aria-live="polite" ref={zoomOutputRef}>100%</output>
          <button onClick={() => graphRef.current?.zoomBy(.15)} aria-label="Zoom in" title="Zoom in" type="button">＋</button>
          <span />
          <button onClick={() => graphRef.current?.fit()} aria-label="Fit conversation map" title="Fit conversation map" type="button">⌗</button>
        </div>
      </div>
    </section>
  );
}
