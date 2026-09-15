export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="border border-dashed border-black/15 bg-white px-6 py-12 text-center">
      <p className="text-base font-semibold text-jf-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-jf-muted">{body}</p>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="landing-tracked text-[10px] font-medium text-jf-muted">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-jf-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-black/10 bg-white p-5 md:p-6">{children}</div>
  );
}
