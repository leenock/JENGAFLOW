import Link from "next/link";
import type { Project, ProjectFinanceSummary } from "@/types/domain";
import {
  budgetUsedPct,
  formatDate,
  formatKes,
  formatKesCompact,
} from "@/lib/format";
import { ProjectStatusBadge } from "@/components/app/project-status-badge";

type ProjectCardProps = {
  project: Project;
  finance: ProjectFinanceSummary | null;
};

function budgetLabel(used: number, remaining: number) {
  if (used >= 100) return { text: "Over budget", tone: "text-jf-red" };
  if (used >= 85) return { text: "Near limit", tone: "text-jf-red" };
  if (remaining > 0 && used >= 60)
    return { text: "On track", tone: "text-jf-ink" };
  return { text: "Healthy", tone: "text-jf-muted" };
}

export function ProjectCard({ project, finance }: ProjectCardProps) {
  const spent = finance?.totalSpentKes ?? 0;
  const used = budgetUsedPct(spent, project.budgetKes);
  const remaining = finance?.remainingBudgetKes ?? project.budgetKes - spent;
  const health = budgetLabel(used, remaining);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block border border-black/10 bg-white p-5 no-underline transition-colors hover:border-jf-ink md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ProjectStatusBadge status={project.status} />
            <span
              className={`landing-tracked text-[9px] font-semibold ${health.tone}`}
            >
              {health.text}
            </span>
          </div>
          <h3 className="mt-3 text-base font-semibold text-jf-ink md:text-lg">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-jf-muted">{project.location}</p>
        </div>
        <span
          aria-hidden
          className="mt-1 text-jf-muted transition-transform group-hover:translate-x-0.5 group-hover:text-jf-ink"
        >
          →
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-black/8 pt-4">
        <div>
          <p className="landing-tracked text-[9px] font-medium text-jf-muted">
            Budget
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-jf-ink">
            {formatKesCompact(project.budgetKes)}
          </p>
        </div>
        <div>
          <p className="landing-tracked text-[9px] font-medium text-jf-muted">
            Spent
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-jf-ink">
            {formatKesCompact(spent)}
          </p>
        </div>
        <div>
          <p className="landing-tracked text-[9px] font-medium text-jf-muted">
            Progress
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-jf-ink">
            {(project.progressPct ?? 0).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-jf-muted">
          <span>Budget used</span>
          <span className="tabular-nums">{used.toFixed(0)}%</span>
        </div>
        <div className="h-1 w-full bg-black/8">
          <div
            className={`h-full ${used >= 85 ? "bg-jf-red" : "bg-jf-ink"}`}
            style={{ width: `${used}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-[11px] text-jf-muted">
        Updated {formatDate(project.updatedAt)} · Client {project.client}
      </p>
      <p className="sr-only">
        Contract {formatKes(project.contractValueKes)}
      </p>
    </Link>
  );
}
