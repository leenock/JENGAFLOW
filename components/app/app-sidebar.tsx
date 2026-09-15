"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SessionUser } from "@/types/domain";
import { canManageTeam, roleLabel } from "@/lib/auth/permissions";
import { homePathForRole } from "@/lib/auth/session";
import { brand } from "@/components/landing/content";

type AppSidebarProps = {
  user: SessionUser;
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
};

type NavItem = {
  href: string;
  label: string;
  ownerOnly?: boolean;
  staffOnly?: boolean;
  isActive: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    ownerOnly: true,
    isActive: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/workspace",
    label: "My sites",
    staffOnly: true,
    isActive: (pathname) => pathname === "/workspace",
  },
  {
    href: "/dashboard#projects",
    label: "Projects",
    ownerOnly: true,
    isActive: (pathname) => pathname.startsWith("/projects"),
  },
  {
    href: "/workspace/people",
    label: "People",
    ownerOnly: true,
    isActive: (pathname) => pathname.startsWith("/workspace/people"),
  },
  {
    href: "/workspace/capture",
    label: "Capture",
    isActive: (pathname) => pathname.startsWith("/workspace/capture"),
  },
  {
    href: "/workspace/profile",
    label: "Profile",
    isActive: (pathname) => pathname.startsWith("/workspace/profile"),
  },
];

export function AppSidebar({
  user,
  open,
  onClose,
  onSignOut,
}: AppSidebarProps) {
  const pathname = usePathname();
  const home = homePathForRole(user.role);
  const isOwner = canManageTeam(user.role);
  const items = NAV_ITEMS.filter((item) => {
    if (item.ownerOnly && !isOwner) return false;
    if (item.staffOnly && isOwner) return false;
    return true;
  });

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-jf-ink/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[17.5rem] shrink-0 flex-col border-r border-black/10 bg-white transition-transform duration-300 md:sticky md:top-0 md:z-0 md:translate-x-0 md:self-start ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-black/10 px-5 py-5">
          <Link
            href={home}
            className="inline-flex items-center gap-3 text-jf-ink no-underline"
            onClick={onClose}
          >
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center border-2 border-current"
            >
              <span className="h-3.5 w-3.5 border-2 border-current border-t-0 border-l-0" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[13px] font-semibold tracking-[0.16em] uppercase">
                {brand.name}
              </span>
              <span className="mt-1 text-[8px] font-medium tracking-[0.18em] text-jf-muted uppercase">
                Workspace
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5" aria-label="Workspace">
          <p className="landing-tracked mb-3 px-2 text-[10px] font-medium text-jf-muted">
            Menu
          </p>
          <ul className="space-y-0.5">
            {items.map((item) => {
              const active = item.isActive(pathname);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2.5 text-sm no-underline transition-colors ${
                      active
                        ? "bg-jf-ink text-white"
                        : "text-jf-ink/80 hover:bg-black/[0.04] hover:text-jf-ink"
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    {active ? (
                      <span className="h-1.5 w-1.5 bg-jf-red" aria-hidden />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 border-t border-black/10 px-2 pt-5">
            <p className="landing-tracked mb-2 text-[10px] font-medium text-jf-muted">
              Organisation
            </p>
            <p className="text-sm font-medium text-jf-ink">
              {user.companyName}
            </p>
            <p className="mt-1 text-xs text-jf-muted">
              {roleLabel(user.role)} access
            </p>
          </div>
        </nav>

        <div className="border-t border-black/10 p-4">
          <button
            type="button"
            onClick={onSignOut}
            className="landing-tracked w-full cursor-pointer border border-black/15 bg-transparent px-3 py-2.5 text-left text-[10px] font-semibold text-jf-ink transition-colors hover:border-jf-ink"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
