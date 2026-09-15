"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "@/types/domain";
import { canManageTeam } from "@/lib/auth/permissions";
import { homePathForRole, readSession, signOut } from "@/lib/auth/session";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import { SupportAssistant } from "./support-assistant";

type AppShellProps = {
  children: ReactNode;
};

function isOwnerOnlyPath(pathname: string): boolean {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return true;
  }
  if (pathname.startsWith("/workspace/people")) return true;
  if (pathname === "/projects/new") return true;
  return false;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const refresh = useCallback(() => {
    setUser(readSession());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    const onSession = () => refresh();
    window.addEventListener("jengaflow:session", onSession);
    window.addEventListener("storage", onSession);
    return () => {
      window.removeEventListener("jengaflow:session", onSession);
      window.removeEventListener("storage", onSession);
    };
  }, [refresh]);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!canManageTeam(user.role) && isOwnerOnlyPath(pathname)) {
      router.replace(homePathForRole(user.role));
    }
  }, [ready, user, router, pathname]);

  const handleSignOut = () => {
    signOut();
    router.replace("/login");
  };

  if (!ready || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f4f4f2] text-jf-ink">
        <p className="landing-tracked text-[11px] font-medium text-jf-muted">
          Loading workspace
        </p>
      </div>
    );
  }

  if (!canManageTeam(user.role) && isOwnerOnlyPath(pathname)) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f4f4f2] text-jf-ink">
        <p className="landing-tracked text-[11px] font-medium text-jf-muted">
          Redirecting
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f4f4f2] text-jf-ink">
      <div className="flex min-h-dvh">
        <AppSidebar
          user={user}
          open={navOpen}
          onClose={() => setNavOpen(false)}
          onSignOut={handleSignOut}
        />

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <AppTopbar
            user={user}
            onMenuClick={() => setNavOpen(true)}
            onSignOut={handleSignOut}
          />
          <main className="flex-1 px-5 py-6 md:px-8 md:py-8 lg:px-10">
            <div className="mx-auto w-full max-w-[1120px]">{children}</div>
          </main>
        </div>
      </div>
      <SupportAssistant user={user} />
    </div>
  );
}
