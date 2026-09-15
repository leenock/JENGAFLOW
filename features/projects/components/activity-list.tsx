import type { ProjectActivity } from "@/types/domain";
import { formatDateTime, formatKes } from "@/lib/format";

const KIND_LABEL: Record<ProjectActivity["kind"], string> = {
  material: "Material",
  labour: "Labour",
  delivery: "Delivery",
  progress: "Progress",
  team: "Team",
  vehicle: "Vehicle",
  workforce: "Crew",
};

export function ActivityList({ items }: { items: ProjectActivity[] }) {
  if (items.length === 0) {
    return (
      <div className="border border-dashed border-black/15 bg-white px-5 py-10 text-center">
        <p className="text-sm text-jf-muted">No site activity recorded yet.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-black/8 border border-black/10 bg-white">
      {items.map((item) => (
        <li key={item.id} className="px-4 py-4 md:px-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="landing-tracked text-[9px] font-semibold text-jf-red">
                {KIND_LABEL[item.kind]}
              </p>
              <p className="mt-1.5 text-sm font-medium text-jf-ink">
                {item.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-jf-muted">
                {item.detail}
              </p>
            </div>
            {item.amountKes != null ? (
              <p className="text-sm font-semibold tabular-nums text-jf-ink">
                {formatKes(item.amountKes)}
              </p>
            ) : null}
          </div>
          <p className="mt-3 text-[11px] text-jf-muted">
            {formatDateTime(item.createdAt)} · {item.createdByName}
          </p>
        </li>
      ))}
    </ul>
  );
}
