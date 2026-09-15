import type { ProjectFinanceSummary } from "@/types/domain";
import { formatKes, formatPct } from "@/lib/format";

type FinanceSummaryProps = {
  finance: ProjectFinanceSummary;
  showProfit: boolean;
};

function Stat({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="border border-black/10 bg-white p-4 md:p-5">
      <p className="landing-tracked text-[9px] font-medium text-jf-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-semibold tabular-nums tracking-tight text-jf-ink ${
          emphasize ? "text-xl md:text-2xl" : "text-lg md:text-xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function ProjectFinancePanel({
  finance,
  showProfit,
}: FinanceSummaryProps) {
  const rows = [
    { label: "Materials", value: finance.materialsKes },
    { label: "Labour", value: finance.labourKes },
    { label: "Deliveries", value: finance.deliveriesKes },
  ];

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="landing-tracked text-[10px] font-medium text-jf-muted">
            Financial position
          </p>
          <h2 className="mt-1 text-lg font-semibold text-jf-ink md:text-xl">
            Spend against budget
          </h2>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Contract value"
          value={formatKes(finance.contractValueKes)}
        />
        <Stat label="Budget" value={formatKes(finance.budgetKes)} />
        <Stat
          label="Total spent"
          value={formatKes(finance.totalSpentKes)}
          emphasize
        />
        <Stat
          label="Remaining budget"
          value={formatKes(finance.remainingBudgetKes)}
        />
      </div>

      <div className="mt-3 border border-black/10 bg-white">
        <div className="border-b border-black/8 px-4 py-3 md:px-5">
          <p className="landing-tracked text-[9px] font-medium text-jf-muted">
            Cost breakdown
          </p>
        </div>
        <ul className="divide-y divide-black/8">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between px-4 py-3.5 text-sm md:px-5"
            >
              <span className="text-jf-ink/80">{row.label}</span>
              <span className="font-medium tabular-nums text-jf-ink">
                {formatKes(row.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {showProfit &&
      finance.runningProfitKes != null &&
      finance.marginPct != null ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Stat
            label="Running profit"
            value={formatKes(finance.runningProfitKes)}
            emphasize
          />
          <Stat
            label="Profit margin"
            value={formatPct(finance.marginPct)}
            emphasize
          />
        </div>
      ) : null}
    </section>
  );
}
