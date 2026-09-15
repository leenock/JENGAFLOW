"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/domain";
import { canExportRecords, canManageTeam } from "@/lib/auth/permissions";

const TABS = [
  { slug: "", label: "Overview", ownerOnly: false },
  { slug: "crew", label: "Site crew", ownerOnly: false },
  { slug: "materials", label: "Materials", ownerOnly: false },
  { slug: "labour", label: "Labour", ownerOnly: false },
  { slug: "deliveries", label: "Deliveries", ownerOnly: false },
  { slug: "vehicles", label: "Vehicles", ownerOnly: false },
  { slug: "progress", label: "Progress", ownerOnly: false },
  { slug: "team", label: "Team", ownerOnly: true },
  { slug: "export", label: "Export", ownerOnly: true },
] as const;

export function ProjectSubnav({
  projectId,
  role,
}: {
  projectId: string;
  role: UserRole;
}) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const tabs = TABS.filter((tab) => {
    if (!tab.ownerOnly) return true;
    if (tab.slug === "team") return canManageTeam(role);
    if (tab.slug === "export") return canExportRecords(role);
    return true;
  });

  const activeHref = (() => {
    for (const tab of tabs) {
      const href = tab.slug ? `${base}/${tab.slug}` : base;
      const active =
        tab.slug === ""
          ? pathname === base
          : pathname.startsWith(`${base}/${tab.slug}`);
      if (active) return href;
    }
    return base;
  })();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => {
      const active = list.querySelector<HTMLElement>("[data-tab-active='true']");
      if (!active) return;
      setIndicator({
        left: active.offsetLeft,
        width: active.offsetWidth,
      });
      active.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeHref, tabs.length]);

  return (
    <nav
      aria-label="Project sections"
      className="-mx-1 overflow-x-auto border-b border-black/10"
    >
      <div className="relative min-w-max px-1">
        <ul ref={listRef} className="relative flex gap-0">
          {tabs.map((tab) => {
            const href = tab.slug ? `${base}/${tab.slug}` : base;
            const active = href === activeHref;

            return (
              <li key={tab.label}>
                <Link
                  href={href}
                  data-tab-active={active ? "true" : "false"}
                  className={`landing-tracked inline-flex px-3 py-3 text-[10px] font-semibold no-underline transition-colors duration-300 md:px-4 ${
                    active
                      ? "text-jf-ink"
                      : "text-jf-muted hover:text-jf-ink"
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 h-0.5 bg-jf-red transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            left: indicator.left,
            width: indicator.width,
          }}
        />
      </div>
    </nav>
  );
}
