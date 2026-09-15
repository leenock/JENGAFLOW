"use client";

import { useEffect, useRef, useState } from "react";
import { brand } from "./content";

type BootPhase = "hold" | "reveal" | "done";

const HOLD_MS = 1100;
const REVEAL_MS = 520;

function formatProgress(value: number) {
  return String(Math.min(100, Math.max(0, Math.round(value)))).padStart(
    2,
    "0",
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** First-paint brand loader for the landing page. */
export function LandingBootLoader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [phase, setPhase] = useState<BootPhase>("hold");
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress(100);
      setPhase("done");
      onCompleteRef.current?.();
      return;
    }

    const timers: number[] = [];
    let raf: number | null = null;
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const runProgress = (durationMs: number) => {
      const started = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - started) / durationMs);
        const eased = 1 - Math.pow(1 - t, 2.4);
        setProgress(eased * 100);
        if (t < 1) {
          raf = window.requestAnimationFrame(tick);
        } else {
          setProgress(100);
          raf = null;
        }
      };
      raf = window.requestAnimationFrame(tick);
    };

    runProgress(HOLD_MS);

    schedule(() => {
      setProgress(100);
      setPhase("reveal");
    }, HOLD_MS);

    schedule(() => {
      setPhase("done");
      onCompleteRef.current?.();
    }, HOLD_MS + REVEAL_MS);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      if (raf != null) window.cancelAnimationFrame(raf);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="page-loader"
      data-phase={phase}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className="page-loader__panel" />
      <div className="page-loader__content">
        <div className="page-loader__brand">
          <span className="page-loader__mark" aria-hidden>
            <span className="page-loader__mark-inner" />
          </span>
          <span className="page-loader__name">
            <span className="page-loader__title">{brand.name}</span>
            <span className="page-loader__tag">{brand.tagline}</span>
          </span>
        </div>
        <p className="page-loader__status">
          <span className="page-loader__status-line">
            clarity on every site
          </span>
          <span className="page-loader__status-label">Loading</span>
        </p>
      </div>
      <p className="page-loader__count">{formatProgress(progress)}</p>
    </div>
  );
}
