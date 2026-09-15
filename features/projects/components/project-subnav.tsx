"use client";

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
  const tabs = TABS.filter((tab) => {
    if (!tab.ownerOnly) return true;
    if (tab.slug === "team") return canManageTeam(role);
    if (tab.slug === "export") return canExportRecords(role);
    return true;
  });

  return (
    <nav
      aria-label="Project sections"
      className="-mx-1 overflow-x-auto border-b border-black/10"
    >
      <ul className="flex min-w-max gap-0 px-1">
        {tabs.map((tab) => {
          const href = tab.slug ? `${base}/${tab.slug}` : base;
          const active =
            tab.slug === ""
              ? pathname === base
              : pathname.startsWith(`${base}/${tab.slug}`);

          return (
            <li key={tab.label}>
              <Link
                href={href}
                className={`landing-tracked inline-flex border-b-2 px-3 py-3 text-[10px] font-semibold no-underline transition-colors md:px-4 ${
                  active
                    ? "border-jf-red text-jf-ink"
                    : "border-transparent text-jf-muted hover:text-jf-ink"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
