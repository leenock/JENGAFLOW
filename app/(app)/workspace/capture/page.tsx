"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project, SessionUser } from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import { canCaptureSiteData } from "@/lib/auth/permissions";
import { getProjectsForSession } from "@/lib/mock/projects";
import { EmptyState } from "@/components/app/ui";

export default function CaptureHubPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    if (!session) return;
    void getProjectsForSession(session).then((list) =>
      setProjects(
        list.filter((p) => p.status === "active" || p.status === "planning"),
      ),
    );
  }, []);

  if (!user) {
    return (
      <p className="landing-tracked text-[11px] font-medium text-jf-muted">
        Loading
      </p>
    );
  }

  if (!canCaptureSiteData(user.role)) {
    return (
      <EmptyState
        title="Capture unavailable"
        body="Your role cannot record site activity."
      />
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <p className="landing-tracked text-[10px] font-medium text-jf-red">
          Site capture
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-jf-ink">
          Record what’s happening on site
        </h1>
        <p className="mt-2 text-sm text-jf-muted">
          Fast entry for materials, labour, deliveries, and progress. Profit and
          margin stay with the owner.{" "}
          <Link
            href="/workspace"
            className="font-medium text-jf-ink no-underline hover:text-jf-red"
          >
            Back to My sites
          </Link>
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects to capture"
          body="Ask the owner to create a project and invite you."
        />
      ) : (
        <ul className="divide-y divide-black/8 border border-black/10 bg-white">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/workspace/capture/${project.id}`}
                className="flex items-center justify-between gap-3 px-4 py-4 no-underline hover:bg-black/[0.02]"
              >
                <div>
                  <p className="font-semibold text-jf-ink">{project.name}</p>
                  <p className="mt-1 text-sm text-jf-muted">{project.location}</p>
                </div>
                <span aria-hidden className="text-jf-muted">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
