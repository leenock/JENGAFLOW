/** Money and date helpers — KES, East Africa context. */

export function formatKes(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatKesCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    const m = amount / 1_000_000;
    return `KES ${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    const k = amount / 1_000;
    return `KES ${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return formatKes(amount);
}

export function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function budgetUsedPct(spent: number, budget: number): number {
  if (budget <= 0) return 0;
  return Math.min(100, (spent / budget) * 100);
}
