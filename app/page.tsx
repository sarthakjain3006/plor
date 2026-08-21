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
        <span className="wordmark" aria-hidden="true">
          <svg viewBox="0 0 214 96" fill="none">
            <g stroke="currentColor" strokeWidth="7" strokeLinecap="round">
              <path d="M14 18v63" />
              <path d="M14 18a24 24 0 0 1 0 48" />
              <path d="M74 66V13" />
              <path d="M151.6 37.8A24 24 0 1 1 132.2 18.4" />
              <path d="M184 18v48" />
              <path d="M184 40l15-15" />
            </g>
            <g fill="currentColor">
              <path d="M14 89 9.5 80h9z" />
              <path d="M8 66 14 61.5v9z" />
              <path d="M74 5 69.5 14h9z" />
              <path d="M139.1 19.6 131.4 22.8 133 14z" />
              <path d="M204 20 202.2 28.2 195.8 21.8z" />
            </g>
          </svg>
        </span>
      </main>
    </>
  );
}
