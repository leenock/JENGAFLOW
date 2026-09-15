"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const TAB_ORDER = [
  "",
  "crew",
  "materials",
  "labour",
  "deliveries",
  "vehicles",
  "progress",
  "team",
  "export",
  "edit",
] as const;

function tabIndex(pathname: string, projectId: string): number {
  const base = `/projects/${projectId}`;
  if (pathname === base) return 0;
  const rest = pathname.slice(base.length + 1).split("/")[0] ?? "";
  const index = TAB_ORDER.indexOf(rest as (typeof TAB_ORDER)[number]);
  return index >= 0 ? index : 0;
}

export function ProjectTabTransition({
  projectId,
  children,
}: {
  projectId: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const index = tabIndex(pathname, projectId);
  const prevIndex = useRef(index);
  const direction = index >= prevIndex.current ? "forward" : "back";

  useEffect(() => {
    prevIndex.current = index;
  }, [index]);

  return (
    <div
      key={pathname}
      className="project-tab-panel"
      data-dir={direction}
    >
      {children}
    </div>
  );
}
