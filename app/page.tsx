"use client";

import {
  useCallback,
  useState,
  type AnimationEvent,
  type CSSProperties,
} from "react";
import Workspace from "./workspace";

type Phase = "gate" | "entering" | "inside" | "done";

function prefersReducedMotion() {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function computeEnterScale() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const portalSize = Math.max(Math.min(Math.min(width, height) * 0.72, 440), 1);
  return Math.ceil((Math.hypot(width, height) / portalSize) * 1.05);
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("gate");
  const [enterScale, setEnterScale] = useState(1);

  const enter = useCallback(() => {
    if (phase !== "gate") return;
    if (prefersReducedMotion()) {
      setPhase("done");
      return;
    }
    setEnterScale(computeEnterScale());
    setPhase("entering");
  }, [phase]);

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

  if (phase === "done") {
    return <Workspace />;
  }

  return (
    <>
      {phase === "inside" && (
        <div className="workspace-reveal">
          <Workspace />
        </div>
      )}
      <main
        className={`gate ${phase !== "gate" ? "entering" : ""} ${
          phase === "inside" ? "leaving" : ""
        }`}
        onAnimationEnd={handleGateAnimationEnd}
      >
        <div
          className="portal"
          aria-hidden="true"
          style={{ "--enter-scale": enterScale } as CSSProperties}
          onAnimationEnd={handlePortalAnimationEnd}
        >
          <h1 className="hello">Hello</h1>
        </div>
        <button
          className="enter-button"
          type="button"
          aria-label="Enter"
          onClick={enter}
        >
          <span aria-hidden="true">→</span>
        </button>
      </main>
    </>
  );
}
