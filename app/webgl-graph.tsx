"use client";

import {
  forwardRef,
  type ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type { Application, Container, FederatedPointerEvent } from "pixi.js";
import type { LayerId, MessagesById } from "./conversation-model";
import type { GraphLayout } from "./graph-layout";

const MIN_SCALE = .42;
const MAX_SCALE = 1.9;

type Camera = { x: number; y: number; scale: number };

export type WebGLGraphHandle = {
  fit: () => void;
  zoomBy: (amount: number) => void;
};

type WebGLGraphProps = {
  activeLayerIds: Set<LayerId>;
  currentLayerId: LayerId;
  graph: GraphLayout;
  messagesById: MessagesById;
  onNavigate: (layerId: LayerId) => void;
  onScaleChange: (scale: number) => void;
};

function WebGLGraphInner({
  activeLayerIds,
  currentLayerId,
  graph,
  messagesById,
  onNavigate,
  onScaleChange,
}: WebGLGraphProps, ref: ForwardedRef<WebGLGraphHandle>) {
  const hostRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<Container | null>(null);
  const cameraRef = useRef<Camera>({ x: 0, y: 0, scale: 1 });
  const navigateRef = useRef(onNavigate);
  const scaleChangeRef = useRef(onScaleChange);

  useEffect(() => {
    navigateRef.current = onNavigate;
    scaleChangeRef.current = onScaleChange;
  }, [onNavigate, onScaleChange]);

  const applyCamera = useCallback(() => {
    const world = worldRef.current;
    if (!world) return;
    const camera = cameraRef.current;
    world.position.set(camera.x, camera.y);
    world.scale.set(camera.scale);
  }, []);

  const setCamera = useCallback((camera: Camera) => {
    cameraRef.current = camera;
    applyCamera();
    scaleChangeRef.current(camera.scale);
  }, [applyCamera]);

  const fit = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    const bounds = host.getBoundingClientRect();
    const padding = bounds.width < 700 ? 36 : 80;
    const scale = Math.min(
      1.15,
      Math.max(
        MIN_SCALE,
        Math.min(
          (bounds.width - padding * 2) / graph.width,
          (bounds.height - padding * 2) / graph.height
        )
      )
    );
    setCamera({
      scale,
      x: (bounds.width - graph.width * scale) / 2,
      y: (bounds.height - graph.height * scale) / 2,
    });
  }, [graph.height, graph.width, setCamera]);

  const zoomAt = useCallback((factor: number, x: number, y: number) => {
    const current = cameraRef.current;
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current.scale * factor));
    const ratio = scale / current.scale;
    setCamera({
      scale,
      x: x - (x - current.x) * ratio,
      y: y - (y - current.y) * ratio,
    });
  }, [setCamera]);

  useImperativeHandle(ref, () => ({
    fit,
    zoomBy(amount: number) {
      const host = hostRef.current;
      if (!host) return;
      const bounds = host.getBoundingClientRect();
      zoomAt(1 + amount, bounds.width / 2, bounds.height / 2);
    },
  }), [fit, zoomAt]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let app: Application | null = null;
    let initialized = false;
    let disposed = false;
    let removeListeners: (() => void) | null = null;

    void (async () => {
      const {
        Application,
        Container,
        Graphics,
        Rectangle,
        Text,
        TextStyle,
      } = await import("pixi.js");
      app = new Application();
      await app.init({
        antialias: true,
        autoDensity: true,
        backgroundAlpha: 0,
        preference: "webgl",
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        resizeTo: host,
      });
      initialized = true;
      if (disposed) {
        app.destroy(true, { children: true });
        return;
      }

      host.replaceChildren(app.canvas);
      app.canvas.setAttribute("aria-label", "Interactive conversation graph");
      app.canvas.setAttribute("role", "img");
      app.canvas.style.cursor = "grab";

      const world = new Container();
      worldRef.current = world;
      app.stage.addChild(world);
      app.stage.eventMode = "static";
      app.stage.hitArea = app.screen;

      let panPoint: { x: number; y: number } | null = null;
      app.stage.on("pointerdown", (event: FederatedPointerEvent) => {
        panPoint = { x: event.global.x, y: event.global.y };
        if (app) app.canvas.style.cursor = "grabbing";
      });
      app.stage.on("pointermove", (event: FederatedPointerEvent) => {
        if (!panPoint) return;
        const dx = event.global.x - panPoint.x;
        const dy = event.global.y - panPoint.y;
        panPoint = { x: event.global.x, y: event.global.y };
        cameraRef.current.x += dx;
        cameraRef.current.y += dy;
        applyCamera();
      });
      const endPan = () => {
        panPoint = null;
        if (app) app.canvas.style.cursor = "grab";
      };
      app.stage.on("pointerup", endPan);
      app.stage.on("pointerupoutside", endPan);

      for (const node of graph.nodes) {
        if (!node.parentId) continue;
        const parent = graph.nodesById.get(node.parentId);
        if (!parent) continue;
        const active = activeLayerIds.has(parent.id) && activeLayerIds.has(node.id);
        world.addChild(
          new Graphics()
            .moveTo(parent.x + 92, parent.y + 76)
            .bezierCurveTo(
              parent.x + 92,
              parent.y + 99,
              node.x + 92,
              node.y - 23,
              node.x + 92,
              node.y
            )
            .stroke({ color: active ? 0x5faa7a : 0x3d3f3b, width: active ? 2 : 1.5 })
        );
      }

      const titleStyle = new TextStyle({
        fill: 0xe1e2dd,
        fontFamily: "Arial, sans-serif",
        fontSize: 10,
        fontWeight: "500",
        leading: 2,
        wordWrap: true,
        wordWrapWidth: 160,
      });
      const kickerStyle = new TextStyle({ fill: 0x858880, fontFamily: "Arial, sans-serif", fontSize: 8, fontWeight: "700" });
      const activeKickerStyle = new TextStyle({ fill: 0x76bc8d, fontFamily: "Arial, sans-serif", fontSize: 8, fontWeight: "700" });
      const metaStyle = new TextStyle({ fill: 0x72746e, fontFamily: "Arial, sans-serif", fontSize: 8 });
      const currentMetaStyle = new TextStyle({ fill: 0x77bd8d, fontFamily: "Arial, sans-serif", fontSize: 8 });

      for (const node of graph.nodes) {
        const onPath = activeLayerIds.has(node.id);
        const current = node.id === currentLayerId;
        const group = new Container();
        group.position.set(node.x, node.y);
        group.eventMode = "static";
        group.cursor = "pointer";
        group.hitArea = new Rectangle(0, 0, 184, 76);

        const card = new Graphics()
          .roundRect(0, 0, 184, 76, 7)
          .fill({ color: onPath ? 0x1d2821 : 0x20211f })
          .stroke({ color: current ? 0x70bd88 : onPath ? 0x477258 : 0x3c3e3a, width: current ? 2 : 1 });
        group.addChild(card);

        const summaryId = node.messageIds.find((messageId) => messageId !== node.anchorMessageId)
          ?? node.messageIds[0];
        const summaryText = messagesById[summaryId]?.text ?? "Fresh conversation";
        const clippedSummary = summaryText.length > 76 ? `${summaryText.slice(0, 73)}...` : summaryText;
        const kicker = new Text({
          text: node.depth === 0 ? "ROOT" : `LAYER ${node.depth}`,
          style: onPath ? activeKickerStyle : kickerStyle,
        });
        kicker.position.set(11, 9);
        group.addChild(kicker);

        const title = new Text({ text: clippedSummary, style: titleStyle });
        title.position.set(11, 25);
        group.addChild(title);

        const meta = new Text({
          text: current
            ? "Current page"
            : `${node.messageIds.length} ${node.messageIds.length === 1 ? "message" : "messages"}`,
          style: current ? currentMetaStyle : metaStyle,
        });
        meta.position.set(11, 61);
        group.addChild(meta);

        group.on("pointerover", () => { card.alpha = .82; });
        group.on("pointerout", () => { card.alpha = 1; });
        group.on("pointerdown", (event: FederatedPointerEvent) => { event.stopPropagation(); });
        group.on("pointertap", (event: FederatedPointerEvent) => {
          event.stopPropagation();
          navigateRef.current(node.id);
        });
        world.addChild(group);
      }

      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const bounds = host.getBoundingClientRect();
        zoomAt(
          Math.exp(-event.deltaY * .0014),
          event.clientX - bounds.left,
          event.clientY - bounds.top
        );
      };
      host.addEventListener("wheel", handleWheel, { passive: false });
      const handleResize = () => fit();
      window.addEventListener("resize", handleResize);
      window.requestAnimationFrame(fit);

      removeListeners = () => {
        host.removeEventListener("wheel", handleWheel);
        window.removeEventListener("resize", handleResize);
      };
    })();

    return () => {
      disposed = true;
      removeListeners?.();
      worldRef.current = null;
      if (app && initialized) app.destroy(true, { children: true });
      host.replaceChildren();
    };
  }, [activeLayerIds, applyCamera, currentLayerId, fit, graph, messagesById, zoomAt]);

  return <div className="graph-webgl" ref={hostRef} />;
}

const WebGLGraph = forwardRef(WebGLGraphInner);
WebGLGraph.displayName = "WebGLGraph";

export default WebGLGraph;
