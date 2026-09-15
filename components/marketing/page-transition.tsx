"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { brand } from "@/components/landing/content";

type TransitionContextValue = {
  navigate: (href: string) => void;
  pending: boolean;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("usePageTransition must be used within PageTransitionProvider");
  }
  return ctx;
}

const COVER_MS = 380;
const HOLD_MS = 720;
const REVEAL_MS = 520;
const TOTAL_MS = COVER_MS + HOLD_MS + REVEAL_MS;

function formatProgress(value: number) {
  return String(Math.min(100, Math.max(0, Math.round(value)))).padStart(
    2,
    "0",
  );
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "cover" | "hold" | "reveal">(
    "idle",
  );
  const [progress, setProgress] = useState(0);
  const busyRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const runProgress = useCallback((durationMs: number) => {
    const started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / durationMs);
      // Ease out so it feels like Maman's loader — fast early, settles near 100
      const eased = 1 - Math.pow(1 - t, 2.4);
      setProgress(eased * 100);
      if (t < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        setProgress(100);
        rafRef.current = null;
      }
    };
    rafRef.current = window.requestAnimationFrame(tick);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (href.startsWith("mailto:") || href.startsWith("http")) {
        window.location.href = href;
        return;
      }
      const target = href.split("#")[0] || "/";
      if (target === pathname || busyRef.current) return;

      clearTimers();
      busyRef.current = true;
      setProgress(0);
      setPhase("cover");

      const schedule = (fn: () => void, ms: number) => {
        timersRef.current.push(window.setTimeout(fn, ms));
      };

      // Start counting as soon as the panel is covering
      schedule(() => {
        setPhase("hold");
        runProgress(HOLD_MS + 80);
      }, COVER_MS * 0.55);

      schedule(() => {
        router.push(href);
      }, COVER_MS + HOLD_MS * 0.45);

      schedule(() => {
        setProgress(100);
        setPhase("reveal");
      }, COVER_MS + HOLD_MS);

      schedule(() => {
        setPhase("idle");
        setProgress(0);
        busyRef.current = false;
      }, TOTAL_MS);
    },
    [pathname, router, clearTimers, runProgress],
  );

  const active = phase !== "idle";

  return (
    <TransitionContext.Provider value={{ navigate, pending: active }}>
      {children}
      <div
        className="page-loader"
        data-phase={phase}
        aria-hidden={!active}
        aria-busy={active}
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
            <span className="page-loader__status-line">clarity on every site</span>
            <span className="page-loader__status-label">Loading</span>
          </p>
        </div>
        <p className="page-loader__count">{formatProgress(progress)}</p>
      </div>
    </TransitionContext.Provider>
  );
}
