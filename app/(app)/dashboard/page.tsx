"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  Project,
  ProjectFinanceSummary,
  ProgressUpdate,
  SessionUser,
} from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import {
  getCompanyOverview,
  getProjectFinanceSummary,
  getProjects,
  getRecentCompanyProgress,
} from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { formatDate, formatKes, formatKesCompact } from "@/lib/format";
import { ProjectCard } from "@/features/projects/components/project-card";

type Overview = Awaited<ReturnType<typeof getCompanyOverview>>;
type RecentProgress = ProgressUpdate & { projectName: string };

export default function DashboardPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [financeMap, setFinanceMap] = useState<
    Record<string, ProjectFinanceSummary | null>
  >({});
  const [overview, setOverview] = useState<Overview | null>(null);
  const [recentProgress, setRecentProgress] = useState<RecentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    if (!session) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      const list = await getProjects(session.companyId);
      const company = await getCompanyOverview(session.companyId);
      const diary = await getRecentCompanyProgress(session.companyId, 5);
      const entries = await Promise.all(
        list.map(async (project) => {
          const finance = await getProjectFinanceSummary(
            project.id,
            session.role,
          );
          return [project.id, finance] as const;
        }),
      );

      if (cancelled) return;
      setProjects(list);
      setOverview(company);
      setFinanceMap(Object.fromEntries(entries));
      setRecentProgress(diary);
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
  }, []);

  if (loading) {
    return (
      <p className="landing-tracked text-[11px] font-medium text-jf-muted">
        Loading projects
      </p>
    );
  }

  if (!user || !overview) return null;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="landing-tracked text-[10px] font-medium text-jf-red">
            Owner workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-jf-ink md:text-3xl">
            {user.companyName}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-jf-muted">
            How much have you spent — and how far has construction actually
            reached? Open a project for finance and the site diary.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center justify-center bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline transition-opacity hover:opacity-90"
        >
          New project
        </Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Projects"
          value={String(overview.projectCount)}
          hint={`${overview.activeCount} active`}
        />
        <Metric
          label="Contract value"
          value={formatKesCompact(overview.totalContractKes)}
        />
        <Metric
          label="Total budget"
          value={formatKesCompact(overview.totalBudgetKes)}
        />
        <Metric
          label="Spent to date"
          value={formatKesCompact(overview.totalSpentKes)}
          hint={`${formatKes(overview.remainingBudgetKes)} remaining`}
        />
      </section>

      <section>
        <div className="mb-4">
          <p className="landing-tracked text-[10px] font-medium text-jf-muted">
            Construction progress
          </p>
          <h2 className="mt-1 text-lg font-semibold text-jf-ink">
            Latest from the sites
          </h2>
        </div>
        {recentProgress.length === 0 ? (
          <div className="border border-dashed border-black/15 bg-white px-5 py-8 text-center text-sm text-jf-muted">
            Progress photos and stage notes will appear here as the team
            uploads.
          </div>
        ) : (
          <ul className="divide-y divide-black/8 border border-black/10 bg-white">
            {recentProgress.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/projects/${item.projectId}/progress`}
                  className="flex flex-col gap-1 px-4 py-4 no-underline hover:bg-black/[0.02] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] text-jf-muted">
                      {item.projectName} · {formatDate(item.createdAt)}
                    </p>
                    <p className="mt-1 font-semibold text-jf-ink">{item.title}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-jf-muted">
                      {item.description}
                    </p>
                  </div>
                  <span className="landing-tracked shrink-0 text-[9px] font-semibold text-jf-muted">
                    {item.mediaLabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="projects">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="landing-tracked text-[10px] font-medium text-jf-muted">
              Projects
            </p>
            <h2 className="mt-1 text-lg font-semibold text-jf-ink">
              Sites under this organisation
            </h2>
          </div>
          <span className="landing-tracked text-[10px] font-semibold text-jf-muted">
            {projects.length} total
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="border border-dashed border-black/15 bg-white px-6 py-14 text-center">
            <p className="text-base font-semibold text-jf-ink">
              No projects yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-jf-muted">
              Create your first site to set contract value, budget, and invite
              clerks or foremen.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                finance={financeMap[project.id] ?? null}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border border-black/10 bg-white p-4 md:p-5">
      <p className="landing-tracked text-[9px] font-medium text-jf-muted">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums text-jf-ink md:text-2xl">
        {value}
      </p>
      {hint ? <p className="mt-1 text-[11px] text-jf-muted">{hint}</p> : null}
    </div>
  );
}
