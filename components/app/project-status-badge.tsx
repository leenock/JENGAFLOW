import type { ProjectStatus } from "@/types/domain";

const STATUS: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  planning: {
    label: "Planning",
    className: "border-black/20 text-jf-muted",
  },
  active: {
    label: "Active",
    className: "border-jf-red/40 text-jf-red",
  },
  on_hold: {
    label: "On hold",
    className: "border-amber-700/30 text-amber-800",
  },
  completed: {
    label: "Completed",
    className: "border-emerald-800/25 text-emerald-900",
  },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = STATUS[status];
  return (
    <span
      className={`landing-tracked inline-flex border px-2 py-1 text-[9px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
