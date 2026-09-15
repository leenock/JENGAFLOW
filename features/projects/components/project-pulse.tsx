"use client";

import { useState, type FormEvent } from "react";
import type { ProjectPulse, SessionUser } from "@/types/domain";
import { canManageProjects, canViewFinance } from "@/lib/auth/permissions";
import { updateProjectProgressPct } from "@/lib/mock/projects";
import { formatDate, formatKes, formatKesCompact } from "@/lib/format";

type ProjectPulsePanelProps = {
  pulse: ProjectPulse;
  user: SessionUser;
};

function paceStyles(pace: ProjectPulse["spendPace"]) {
  switch (pace) {
    case "ahead":
      return {
        border: "border-jf-red/40",
        bg: "bg-jf-red/5",
        label: "Spending ahead of progress",
        tone: "text-jf-red",
      };
    case "behind":
      return {
        border: "border-black/20",
        bg: "bg-white",
        label: "Progress ahead of spend",
        tone: "text-jf-ink",
      };
    case "aligned":
      return {
        border: "border-black/10",
        bg: "bg-white",
        label: "Spend and progress aligned",
        tone: "text-jf-muted",
      };
    default:
      return {
        border: "border-black/10",
        bg: "bg-white",
        label: "Set progress to unlock risk view",
        tone: "text-jf-muted",
      };
  }
}

export function ProjectPulsePanel({ pulse, user }: ProjectPulsePanelProps) {
  const showFinance = canViewFinance(user.role);
  const canEditProgress = canManageProjects(user.role) || user.role === "foreman";
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(String(pulse.progressPct));
  const pace = paceStyles(pulse.spendPace);

  const onSaveProgress = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    await updateProjectProgressPct(
      pulse.projectId,
      user.companyId,
      Number(value),
    );
    setPending(false);
    setEditing(false);
  };

  return (
    <section className="space-y-4">
      <div>
        <p className="landing-tracked text-[10px] font-medium text-jf-red">
          Project pulse
        </p>
        <h2 className="mt-1 text-lg font-semibold text-jf-ink md:text-xl">
          How is this site actually doing?
        </h2>
      </div>

      {showFinance && pulse.riskMessage ? (
        <div
          className={`border px-4 py-3 md:px-5 ${pace.border} ${pace.bg}`}
          role="status"
        >
          <p className={`landing-tracked text-[10px] font-semibold ${pace.tone}`}>
            {pace.label}
          </p>
          <p className="mt-1 text-sm text-jf-ink">{pulse.riskMessage}</p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {showFinance ? (
          <>
            <PulseStat
              label="Latest site day"
              value={formatKesCompact(pulse.todaySpentKes)}
            />
            <PulseStat
              label="Month of that activity"
              value={formatKesCompact(pulse.monthSpentKes)}
            />
            <PulseStat
              label="Budget used"
              value={`${pulse.budgetUsedPct.toFixed(0)}%`}
              hint={formatKes(pulse.finance.remainingBudgetKes) + " left"}
            />
          </>
        ) : (
          <PulseStat
            label="Latest diary"
            value={pulse.latestProgressTitle ?? "No updates yet"}
            hint={
              pulse.latestProgressAt
                ? formatDate(pulse.latestProgressAt)
                : undefined
            }
          />
        )}
        <div className="border border-black/10 bg-white p-4 md:p-5">
          <p className="landing-tracked text-[9px] font-medium text-jf-muted">
            Construction progress
          </p>
          {editing ? (
            <form
              className="mt-2 flex items-end gap-2"
              onSubmit={(e) => void onSaveProgress(e)}
            >
              <label className="min-w-0 flex-1">
                <span className="sr-only">Progress percent</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full border-0 border-b border-black/20 bg-transparent py-1 text-xl font-semibold tabular-nums outline-none focus:border-jf-red"
                />
              </label>
              <button
                type="submit"
                disabled={pending}
                className="cursor-pointer bg-black px-2.5 py-2 text-[10px] font-semibold tracking-[0.12em] text-white uppercase disabled:opacity-60"
              >
                Save
              </button>
            </form>
          ) : (
            <>
              <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums text-jf-ink md:text-2xl">
                {pulse.progressPct.toFixed(0)}%
              </p>
              {canEditProgress ? (
                <button
                  type="button"
                  onClick={() => {
                    setValue(String(pulse.progressPct));
                    setEditing(true);
                  }}
                  className="mt-2 cursor-pointer text-[11px] font-semibold text-jf-muted hover:text-jf-red"
                >
                  Update estimate
                </button>
              ) : null}
            </>
          )}
          {showFinance ? (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-[10px] text-jf-muted">
                <span>Progress</span>
                <span>Budget</span>
              </div>
              <div className="relative h-1.5 w-full bg-black/8">
                <div
                  className="absolute inset-y-0 left-0 bg-jf-ink/40"
                  style={{ width: `${pulse.budgetUsedPct}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-jf-red"
                  style={{ width: `${pulse.progressPct}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-jf-muted">
                Red = progress · grey = budget used
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {showFinance && pulse.latestProgressTitle ? (
        <p className="text-sm text-jf-muted">
          Latest diary:{" "}
          <span className="font-medium text-jf-ink">
            {pulse.latestProgressTitle}
          </span>
          {pulse.latestProgressAt
            ? ` · ${formatDate(pulse.latestProgressAt)}`
            : null}
        </p>
      ) : null}
    </section>
  );
}

function PulseStat({
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
