"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Project, SessionUser } from "@/types/domain";
import { canManageProjects } from "@/lib/auth/permissions";
import { homePathForRole, readSession } from "@/lib/auth/session";
import { getProject, getProjectsForSession } from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { formatDate } from "@/lib/format";
import { ProjectStatusBadge } from "@/components/app/project-status-badge";
import { ProjectSubnav } from "@/features/projects/components/project-subnav";
import { ProjectTabTransition } from "@/features/projects/components/project-tab-transition";

export default function ProjectLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [allowed, setAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = readSession();
    setUser(session);

    const load = async () => {
      if (!session || !projectId) {
        setLoading(false);
        return;
      }
      const row = await getProject(projectId, session.companyId);
      if (!row) {
        setProject(null);
        setAllowed(false);
        setLoading(false);
        return;
      }

      if (session.role !== "owner") {
        const scoped = await getProjectsForSession(session);
        if (!scoped.some((p) => p.id === projectId)) {
          setProject(null);
          setAllowed(false);
          setLoading(false);
          return;
        }
      }

      // Site roles shouldn't land on owner-only tabs
      const path = window.location.pathname;
      if (
        session.role !== "owner" &&
        (path.endsWith("/team") ||
          path.endsWith("/export") ||
          path.endsWith("/edit"))
      ) {
        router.replace(`/projects/${projectId}`);
        return;
      }

      setProject(row);
      setAllowed(true);
      setLoading(false);
    };

    void load();
    return subscribeMockDb(() => {
      void load();
    });
  }, [projectId, router]);

  if (loading) {
    return (
      <p className="landing-tracked text-[11px] font-medium text-jf-muted">
        Loading project
      </p>
    );
  }

  if (!project || !user || !allowed) {
    return (
      <div className="border border-dashed border-black/15 bg-white px-6 py-14 text-center">
        <p className="text-base font-semibold text-jf-ink">
          {allowed === false ? "No access to this project" : "Project not found"}
        </p>
        <Link
          href={user ? homePathForRole(user.role) : "/login"}
          className="mt-6 inline-flex bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline"
        >
          Back
        </Link>
      </div>
    );
  }

  const backHref =
    user.role === "owner" ? "/dashboard" : "/workspace";

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={backHref}
          className="landing-tracked text-[10px] font-semibold text-jf-muted no-underline hover:text-jf-ink"
        >
          ← {user.role === "owner" ? "Overview" : "My sites"}
        </Link>
        <header className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <ProjectStatusBadge status={project.status} />
              <span className="text-[11px] text-jf-muted">
                Started {formatDate(project.startDate)}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-jf-ink md:text-3xl">
              {project.name}
            </h1>
            <p className="mt-2 text-sm text-jf-muted">
              {project.location} · Client {project.client}
            </p>
          </div>
          {canManageProjects(user.role) ? (
            <Link
              href={`/projects/${project.id}/edit`}
              className="landing-tracked inline-flex border border-black/15 bg-white px-3 py-2 text-[10px] font-semibold text-jf-ink no-underline hover:border-jf-ink"
            >
              Edit project
            </Link>
          ) : (
            <Link
              href={`/workspace/capture/${project.id}`}
              className="landing-tracked inline-flex bg-jf-red px-3 py-2 text-[10px] font-semibold text-white no-underline"
            >
              Quick capture
            </Link>
          )}
        </header>
      </div>

      <ProjectSubnav projectId={project.id} role={user.role} />
      <ProjectTabTransition projectId={project.id}>
        {children}
      </ProjectTabTransition>
    </div>
  );
}
