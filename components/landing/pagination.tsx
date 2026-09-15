"use client";

type PaginationProps = {
  total: number;
  current: number;
  tone: "light" | "dark";
  onSelect: (chapterNumber: number) => void;
  /** fixed = overlay on intro screens; card = left rail inside the detail card */
  variant?: "fixed" | "card";
  /** When variant=card, drives the rail entrance animation */
  reveal?: boolean;
};

export function Pagination({
  total,
  current,
  tone,
  onSelect,
  variant = "fixed",
  reveal = false,
}: PaginationProps) {
  const light = tone === "light";
  const label = `${current}/${String(total).padStart(2, "0")}`;

  const dots = (
    <ul
      className={`flex flex-col items-center gap-3 ${
        variant === "fixed" ? "pointer-events-auto" : ""
      }`}
    >
      {Array.from({ length: total }, (_, index) => {
        const chapterNumber = index + 1;
        const selected = chapterNumber === current;
        return (
          <li key={chapterNumber}>
            <button
              type="button"
              aria-label={`Go to section ${chapterNumber}`}
              aria-current={selected ? "true" : undefined}
              onClick={() => onSelect(chapterNumber)}
              className={`grid h-5 w-5 cursor-pointer place-items-center ${
                selected
                  ? light
                    ? "rounded-full border border-white"
                    : "bg-jf-ink"
                  : ""
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  selected
                    ? light
                      ? "bg-white"
                      : "bg-jf-ink"
                    : light
                      ? "bg-white/55"
                      : "bg-jf-ink/35"
                }`}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "card") {
    return (
      <aside
        className="card-rail-reveal my-10 ml-5 flex w-12 shrink-0 flex-col items-center justify-center gap-6 self-stretch border-r border-black/12 py-8 md:my-14 md:ml-8 md:w-14 md:gap-8 md:py-10 lg:ml-10"
        data-shown={reveal ? "true" : "false"}
        style={{ transitionDelay: reveal ? "280ms" : "0ms" }}
        aria-label="Section"
      >
        <div
          className="landing-vertical-label text-xl font-semibold tracking-[0.12em] text-jf-ink/55 tabular-nums md:text-2xl"
          aria-hidden
        >
          {label}
        </div>
        {dots}
      </aside>
    );
  }

  return (
    <div className="pointer-events-none fixed top-1/2 left-2 z-30 -translate-y-1/2 sm:left-3 md:left-5 lg:left-7">
      <div
        className={`flex flex-col items-center gap-5 border px-2.5 py-5 md:px-3 md:py-7 ${
          light ? "border-white/35 text-white" : "border-jf-ink/20 text-jf-ink/45"
        }`}
      >
        <div
          className={`landing-vertical-label text-2xl font-semibold tracking-[0.14em] tabular-nums md:text-4xl md:font-medium ${
            light ? "text-white" : "text-jf-ink/35"
          }`}
          aria-hidden
        >
          {label}
        </div>
        {dots}
      </div>
    </div>
  );
}
