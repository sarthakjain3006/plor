"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type AnimationEvent,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
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

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Hello";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const subscribeNoop = () => () => {};

export default function Home() {
  const [phase, setPhase] = useState<Phase>("gate");
  const [enterScale, setEnterScale] = useState(1);
  // Server HTML always says "Hello"; the client swaps in a time-of-day greeting.
  const message = useSyncExternalStore(subscribeNoop, greeting, () => "Hello");

  const enter = useCallback(() => {
    if (phase !== "gate") return;
    if (prefersReducedMotion()) {
      setPhase("done");
      return;
    }
    setEnterScale(computeEnterScale());
    setPhase("entering");
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
      {phase === "inside" && (
        <div className="workspace-reveal">
          <Workspace />
        </div>
      )}
      <main
        className={`gate ${phase !== "gate" ? "entering" : ""} ${
          phase === "inside" ? "leaving" : ""
        }`}
        onClick={enter}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onAnimationEnd={handleGateAnimationEnd}
      >
        <h1 className="sr-only">plor</h1>
        <div className="portal-tilt">
          <div
            className="portal"
            aria-hidden="true"
            style={{ "--enter-scale": enterScale } as CSSProperties}
            onAnimationEnd={handlePortalAnimationEnd}
          >
            <p className="hello">{message}</p>
          </div>
        </div>
        <button
          className="enter-button"
          type="button"
          aria-label="Enter"
          onClick={enter}
        >
          <span aria-hidden="true">→</span>
        </button>
        <span className="wordmark" aria-hidden="true">plor</span>
      </main>
    </>
  );
}
