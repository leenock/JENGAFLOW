"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project, ProjectActivity, SessionUser } from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import { canManageTeam, roleLabel } from "@/lib/auth/permissions";
import {
  getProjectsForSession,
  getRecentActivitiesForSession,
} from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { formatDateTime } from "@/lib/format";
import { ProjectStatusBadge } from "@/components/app/project-status-badge";
import { EmptyState } from "@/components/app/ui";

type StaffActivity = ProjectActivity & { projectName: string };

const KIND_LABEL: Record<ProjectActivity["kind"], string> = {
  material: "Material",
  labour: "Labour",
  delivery: "Delivery",
  progress: "Progress",
  team: "Team",
  vehicle: "Vehicle",
  workforce: "Crew",
};

const QUICK_CAPTURE = [
  { kind: "material", label: "Material" },
  { kind: "labour", label: "Labour" },
  { kind: "delivery", label: "Delivery" },
  { kind: "progress", label: "Progress" },
] as const;

export default function StaffWorkspacePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<StaffActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    if (!session) {
      setLoading(false);
      return;
    }
    if (canManageTeam(session.role)) {
      router.replace("/dashboard");
      return;
    }

    let cancelled = false;

    const load = async () => {
      const list = await getProjectsForSession(session);
      const recent = await getRecentActivitiesForSession(session, 8);
      if (cancelled) return;
      setProjects(
        list.filter((p) => p.status === "active" || p.status === "planning"),
      );
      setActivities(recent);
      setLoading(false);
    };

    void load();
    const unsub = subscribeMockDb(() => {
      void load();
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, [router]);

  if (loading || !user) {
    return (
      <p className="landing-tracked text-[11px] font-medium text-jf-muted">
        Loading your sites
      </p>
    );
  }

  if (canManageTeam(user.role)) {
    return (
      <p className="landing-tracked text-[11px] font-medium text-jf-muted">
        Redirecting
      </p>
    );
  }

  const singleSite = projects.length === 1 ? projects[0] : null;
  const captureHref = (kind?: string) => {
    if (singleSite) {
      const base = `/workspace/capture/${singleSite.id}`;
      return kind ? `${base}?kind=${kind}` : base;
    }
    return "/workspace/capture";
  };

  return (
    <div className="space-y-10">
      <header className="border-b border-black/10 pb-6">
        <p className="landing-tracked text-[10px] font-medium text-jf-red">
          {roleLabel(user.role)} workspace
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-jf-ink md:text-3xl">
          Hi {user.name.split(" ")[0]}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-jf-muted">
          Your assigned sites — capture materials, labour, deliveries, and
          progress. Profit and budget stay with the owner.
        </p>
      </header>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="landing-tracked text-[10px] font-medium text-jf-muted">
              Quick capture
            </p>
            <h2 className="mt-1 text-lg font-semibold text-jf-ink">
              Record what’s happening
            </h2>
          </div>
          <Link
            href="/workspace/capture"
            className="landing-tracked text-[10px] font-semibold text-jf-ink no-underline hover:text-jf-red"
          >
            All sites →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {QUICK_CAPTURE.map((item) => (
            <Link
              key={item.kind}
              href={captureHref(item.kind)}
              className="border border-black/10 bg-white px-3 py-4 text-center text-sm font-medium text-jf-ink no-underline transition-colors hover:border-jf-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="landing-tracked text-[10px] font-medium text-jf-muted">
            Assigned sites
          </p>
          <h2 className="mt-1 text-lg font-semibold text-jf-ink">
            Projects you work on
          </h2>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No sites assigned"
            body="Ask the owner to invite you to a project from People or Team."
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex flex-col border border-black/10 bg-white"
              >
                <div className="flex flex-1 flex-col gap-3 px-4 py-4 md:px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <ProjectStatusBadge status={project.status} />
                    <span className="text-[11px] tabular-nums text-jf-muted">
                      ~{project.progressPct}% built
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-jf-ink">
                      {project.name}
                    </p>
                    <p className="mt-1 text-sm text-jf-muted">
                      {project.location}
                    </p>
                  </div>
                </div>
                <div className="flex border-t border-black/10">
                  <Link
                    href={`/workspace/capture/${project.id}`}
                    className="flex-1 px-4 py-3 text-center text-[11px] font-semibold tracking-[0.12em] text-white uppercase no-underline bg-jf-ink hover:opacity-90"
                  >
                    Capture
                  </Link>
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex-1 border-l border-black/10 px-4 py-3 text-center text-[11px] font-semibold tracking-[0.12em] text-jf-ink uppercase no-underline hover:bg-black/[0.02]"
                  >
                    Open site
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-4">
          <p className="landing-tracked text-[10px] font-medium text-jf-muted">
            Recent on your sites
          </p>
          <h2 className="mt-1 text-lg font-semibold text-jf-ink">
            Latest activity
          </h2>
        </div>

        {activities.length === 0 ? (
          <div className="border border-dashed border-black/15 bg-white px-5 py-8 text-center text-sm text-jf-muted">
            Nothing logged yet. Use Capture to add the first entry.
          </div>
        ) : (
          <ul className="divide-y divide-black/8 border border-black/10 bg-white">
            {activities.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/projects/${item.projectId}`}
                  className="block px-4 py-4 no-underline hover:bg-black/[0.02] md:px-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="landing-tracked text-[9px] font-semibold text-jf-red">
                      {KIND_LABEL[item.kind]}
                    </span>
                    <span className="text-[11px] text-jf-muted">
                      {item.projectName}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-jf-ink">
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-jf-muted">
                    {item.detail}
                  </p>
                  <p className="mt-2 text-[11px] text-jf-muted">
                    {formatDateTime(item.createdAt)} · {item.createdByName}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
