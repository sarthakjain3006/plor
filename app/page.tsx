"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import Workspace from "./workspace";

type Phase = "gate" | "preparing" | "entering" | "inside" | "done";

type PortalGeometry = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

function prefersReducedMotion() {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function computePortalGeometry(portal: HTMLElement, target: HTMLElement): PortalGeometry {
  // Measure the unanimated button box so the idle breathing transform cannot
  // introduce a small offset or size mismatch in the final window.
  const portalRect = portal.parentElement?.getBoundingClientRect()
    ?? portal.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  return {
    x: targetRect.left + targetRect.width / 2 - (portalRect.left + portalRect.width / 2),
    y: targetRect.top + targetRect.height / 2 - (portalRect.top + portalRect.height / 2),
    scaleX: Math.max(targetRect.width / portalRect.width, 0.01),
    scaleY: Math.max(targetRect.height / portalRect.height, 0.01),
  };
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("gate");
  const [portalGeometry, setPortalGeometry] = useState<PortalGeometry>({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
  });
  const portalRef = useRef<HTMLSpanElement>(null);
  const workspaceStageRef = useRef<HTMLDivElement>(null);

  const enter = useCallback(() => {
    if (phase !== "gate") return;
    if (prefersReducedMotion()) {
      setPhase("done");
      return;
    }
    setPhase("preparing");
  }, [phase]);

  useLayoutEffect(() => {
    if (phase !== "preparing") return;

    const frame = window.requestAnimationFrame(() => {
      const portal = portalRef.current;
      const target = workspaceStageRef.current?.querySelector<HTMLElement>(".chat-card");
      if (portal && target) {
        setPortalGeometry(computePortalGeometry(portal, target));
      }
      setPhase("entering");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter") enter();
    },
    [enter]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (phase !== "gate") return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      event.currentTarget.style.setProperty("--mx", x.toFixed(3));
      event.currentTarget.style.setProperty("--my", y.toFixed(3));
    },
    [phase]
  );

  const handlePortalAnimationEnd = useCallback(
    (event: AnimationEvent<HTMLDivElement>) => {
      if (event.animationName === "enter-portal") setPhase("inside");
    },
    []
  );

  const handleGateAnimationEnd = useCallback(
    (event: AnimationEvent<HTMLElement>) => {
      if (event.animationName === "gate-dissolve") setPhase("done");
    },
    []
  );

  // Hand focus to the chat input once inside.
  useEffect(() => {
    if (phase !== "done") return;
    document.querySelector<HTMLInputElement>("[data-chat-input]")?.focus();
  }, [phase]);

  if (phase === "done") {
    return <Workspace />;
  }

  return (
    <>
      {phase !== "gate" && (
        <div
          className="workspace-stage"
          aria-hidden={phase !== "inside"}
          inert={phase !== "inside"}
          ref={workspaceStageRef}
        >
          <Workspace />
        </div>
      )}
      <main
        className={`gate ${phase === "entering" || phase === "inside" ? "entering" : ""} ${
          phase === "inside" ? "leaving" : ""
        }`}
        onClick={enter}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onAnimationEnd={handleGateAnimationEnd}
      >
        <h1 className="sr-only">plor</h1>
        <div className="lockup" aria-hidden="true">
          <svg className="lockup-mark" viewBox="92 30 148 122" fill="none">
            <defs>
              <linearGradient id="lk1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#b5b5b5"/></linearGradient>
              <linearGradient id="lk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eaeaea"/><stop offset="1" stopColor="#a2a2a2"/></linearGradient>
              <linearGradient id="lk3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d2d2d2"/><stop offset="1" stopColor="#8b8b8b"/></linearGradient>
              <linearGradient id="lk4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b5b5b5"/><stop offset="1" stopColor="#737373"/></linearGradient>
              <linearGradient id="lk5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#969696"/><stop offset="1" stopColor="#5c5c5c"/></linearGradient>
              <linearGradient id="lk6" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a7a7a"/><stop offset="1" stopColor="#454545"/></linearGradient>
            </defs>
            <ellipse cx="192" cy="52"  rx="44" ry="15"   fill="url(#lk1)" transform="rotate(-15 192 52)"/>
            <ellipse cx="176" cy="72"  rx="39" ry="13.5" fill="url(#lk2)" transform="rotate(-14 176 72)"/>
            <ellipse cx="160" cy="90"  rx="34" ry="12"   fill="url(#lk3)" transform="rotate(-13 160 90)"/>
            <ellipse cx="145" cy="107" rx="29" ry="10.5" fill="url(#lk4)" transform="rotate(-12 145 107)"/>
            <ellipse cx="131" cy="123" rx="25" ry="9"    fill="url(#lk5)" transform="rotate(-11 131 123)"/>
            <ellipse cx="118" cy="138" rx="21" ry="8"    fill="url(#lk6)" transform="rotate(-10 118 138)"/>
          </svg>
          <p className="hello">
            pl<span className="caret-o"></span>r
          </p>
        </div>
        <div className="portal-tilt">
          <button
            className="portal-button"
            type="button"
            aria-label="Enter"
            onClick={enter}
          >
            <span
              className="portal"
              aria-hidden="true"
              ref={portalRef}
              style={{
                "--portal-x": `${portalGeometry.x}px`,
                "--portal-y": `${portalGeometry.y}px`,
                "--portal-scale-x": portalGeometry.scaleX,
                "--portal-scale-y": portalGeometry.scaleY,
              } as CSSProperties}
              onAnimationEnd={handlePortalAnimationEnd}
            ></span>
          </button>
        </div>
        <span className="wordmark" aria-hidden="true">
          <svg viewBox="0 0 200 170" fill="none">
            <g stroke="currentColor" strokeWidth="7" strokeLinecap="round">
              <path d="M76 13v145" />
              <path d="M106.9 15.2A48 48 0 1 1 92.4 6.9" />
              <path d="M80 92 183 144" />
              <path d="M183 144C150 158 110 160 76 157" />
            </g>
            <g fill="currentColor">
              <path d="M76 4 71.5 13h9z" />
              <path d="M99 9.3 90.9 11.1 93.9 2.7z" />
              <path d="M189.3 147.2 179.8 150.3 186.2 137.7z" />
              <path d="M69 157 76 152.7v8.6z" />
            </g>
          </svg>
        </span>
      </main>
    </>
  );
}
