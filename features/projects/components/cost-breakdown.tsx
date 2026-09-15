"use client";

import { useState } from "react";
import type { CostLine, ProjectCostBreakdown, ProjectFinanceSummary } from "@/types/domain";
import { formatKes } from "@/lib/format";

type CostBreakdownPanelProps = {
  finance: ProjectFinanceSummary;
  breakdown: ProjectCostBreakdown;
};

type Drill = "overview" | "materials" | "suppliers" | "labour" | "deliveries";

export function CostBreakdownPanel({
  finance,
  breakdown,
}: CostBreakdownPanelProps) {
  const [drill, setDrill] = useState<Drill>("overview");

  const categories: Array<{
    key: Drill;
    label: string;
    amount: number;
  }> = [
    { key: "materials", label: "Materials", amount: finance.materialsKes },
    { key: "labour", label: "Labour", amount: finance.labourKes },
    { key: "deliveries", label: "Deliveries", amount: finance.deliveriesKes },
  ];

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="landing-tracked text-[10px] font-medium text-jf-muted">
            Where did the money go?
          </p>
          <h2 className="mt-1 text-lg font-semibold text-jf-ink">
            Cost breakdown
          </h2>
        </div>
        <p className="text-sm font-semibold tabular-nums text-jf-ink">
          {formatKes(finance.totalSpentKes)} spent
        </p>
      </div>

      <div className="border border-black/10 bg-white">
        {drill !== "overview" ? (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/8 px-4 py-3 md:px-5">
            <button
              type="button"
              onClick={() => setDrill("overview")}
              className="landing-tracked cursor-pointer text-[10px] font-semibold text-jf-muted hover:text-jf-ink"
            >
              ← All categories
            </button>
            <div className="flex gap-2">
              {drill === "materials" || drill === "suppliers" ? (
                <>
                  <DrillTab
                    active={drill === "materials"}
                    onClick={() => setDrill("materials")}
                    label="By material"
                  />
                  <DrillTab
                    active={drill === "suppliers"}
                    onClick={() => setDrill("suppliers")}
                    label="By supplier"
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        {drill === "overview" ? (
          <ul className="divide-y divide-black/8">
            {categories.map((row) => {
              const share =
                finance.totalSpentKes > 0
                  ? (row.amount / finance.totalSpentKes) * 100
                  : 0;
              return (
                <li key={row.key}>
                  <button
                    type="button"
                    onClick={() => setDrill(row.key)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left text-sm hover:bg-black/[0.02] md:px-5"
                  >
                    <span className="text-jf-ink/80">
                      {row.label}
                      <span className="ml-2 text-[11px] text-jf-muted">
                        {share.toFixed(0)}%
                      </span>
                    </span>
                    <span className="font-medium tabular-nums text-jf-ink">
                      {formatKes(row.amount)} →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <LineList
            rows={
              drill === "materials"
                ? breakdown.materialsByName
                : drill === "suppliers"
                  ? breakdown.materialsBySupplier
                  : drill === "labour"
                    ? breakdown.labourByRole
                    : breakdown.deliveriesByItem
            }
            emptyLabel={
              drill === "labour"
                ? "No labour payments yet"
                : drill === "deliveries"
                  ? "No delivery fees yet"
                  : "No material purchases yet"
            }
          />
        )}
      </div>

      {finance.runningProfitKes != null && finance.marginPct != null ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="border border-black/10 bg-white p-4 md:p-5">
            <p className="landing-tracked text-[9px] font-medium text-jf-muted">
              Running profit
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums text-jf-ink">
              {formatKes(finance.runningProfitKes)}
            </p>
          </div>
          <div className="border border-black/10 bg-white p-4 md:p-5">
            <p className="landing-tracked text-[9px] font-medium text-jf-muted">
              Profit margin
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums text-jf-ink">
              {finance.marginPct.toFixed(1)}%
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function DrillTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer px-2 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase ${
        active ? "bg-jf-ink text-white" : "border border-black/15 text-jf-ink"
      }`}
    >
      {label}
    </button>
  );
}

function LineList({
  rows,
  emptyLabel,
}: {
  rows: CostLine[];
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-jf-muted md:px-5">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-black/8">
      {rows.map((row) => (
        <li
          key={row.key}
          className="flex items-center justify-between gap-3 px-4 py-3.5 text-sm md:px-5"
        >
          <span className="min-w-0">
            <span className="font-medium text-jf-ink">{row.label}</span>
            <span className="mt-0.5 block text-[11px] text-jf-muted">
              {row.count} record{row.count === 1 ? "" : "s"}
            </span>
          </span>
          <span className="shrink-0 font-medium tabular-nums text-jf-ink">
            {formatKes(row.amountKes)}
          </span>
        </li>
      ))}
    </ul>
  );
}
