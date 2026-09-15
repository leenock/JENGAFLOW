"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animation direction */
  from?: "up" | "down" | "left" | "right" | "fade";
  /** Stagger delay in ms */
  delay?: number;
  /** Once visible, stay revealed */
  once?: boolean;
};

export function Reveal({
  children,
  className = "",
  from = "up",
  delay = 0,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`reveal-block ${className}`}
      data-from={from}
      data-shown={shown ? "true" : "false"}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
