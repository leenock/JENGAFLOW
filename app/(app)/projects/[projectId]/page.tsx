"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type {
  ProgressUpdate,
  ProjectActivity,
  ProjectCostBreakdown,
  ProjectPulse,
  SessionUser,
} from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import { canViewFinance } from "@/lib/auth/permissions";
import {
  getProjectActivities,
  getProjectCostBreakdown,
  getProjectProgress,
  getProjectPulse,
} from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { ProjectPulsePanel } from "@/features/projects/components/project-pulse";
import { CostBreakdownPanel } from "@/features/projects/components/cost-breakdown";
import { ActivityList } from "@/features/projects/components/activity-list";
import { ProgressTimeline } from "@/features/projects/components/progress-timeline";

export default function ProjectOverviewPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [pulse, setPulse] = useState<ProjectPulse | null>(null);
  const [breakdown, setBreakdown] = useState<ProjectCostBreakdown | null>(null);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [progress, setProgress] = useState<ProgressUpdate[]>([]);

  useEffect(() => {
    const session = readSession();
    setUser(session);

    const load = async () => {
      if (!session || !projectId) return;
      const [pulseRow, costRows, activityRows, progressRows] = await Promise.all([
        getProjectPulse(projectId, session.role),
        getProjectCostBreakdown(projectId),
        getProjectActivities(projectId),
        getProjectProgress(projectId, 4),
      ]);
      setPulse(pulseRow);
      setBreakdown(costRows);
      setActivities(activityRows);
      setProgress(progressRows);
    };

    void load();
    return subscribeMockDb(() => {
      void load();
    });
  }, [projectId]);

  if (!user) return null;

  return (
    <div className="space-y-10">
      {pulse ? <ProjectPulsePanel pulse={pulse} user={user} /> : null}

      <div className="flex flex-wrap gap-3 border border-black/10 bg-white px-4 py-3 md:px-5">
        <Link
          href={`/projects/${projectId}/crew`}
          className="inline-flex cursor-pointer bg-jf-ink px-3 py-2 text-[11px] font-semibold tracking-[0.12em] text-white uppercase no-underline"
        >
          Site crew
        </Link>
        <p className="self-center text-sm text-jf-muted">
          Add plumbers, masons, and other workers on this project (trade + pay).
        </p>
      </div>

      {pulse && breakdown && canViewFinance(user.role) ? (
        <CostBreakdownPanel finance={pulse.finance} breakdown={breakdown} />
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="landing-tracked text-[10px] font-medium text-jf-muted">
                Site diary
              </p>
              <h2 className="mt-1 text-lg font-semibold text-jf-ink">
                Latest progress
              </h2>
            </div>
            <Link
              href={`/projects/${projectId}/progress`}
              className="landing-tracked text-[10px] font-semibold text-jf-ink no-underline hover:text-jf-red"
            >
              View all
            </Link>
          </div>
          <ProgressTimeline items={progress} />
        </section>

        <section>
          <div className="mb-4">
            <p className="landing-tracked text-[10px] font-medium text-jf-muted">
              Recent activity
            </p>
            <h2 className="mt-1 text-lg font-semibold text-jf-ink">
              What the site recorded
            </h2>
          </div>
          <ActivityList items={activities} />
        </section>
      </div>
    </div>
  );
}
