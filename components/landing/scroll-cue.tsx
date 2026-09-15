"use client";

import { ScrollArrow } from "./scroll-arrow";

type ScrollCueProps = {
  atEnd: boolean;
  tone: "light" | "dark";
  onClick: () => void;
};

export function ScrollCue({ atEnd, tone, onClick }: ScrollCueProps) {
  // tone "light" = white chrome on video/dark screens
  const onVideo = tone === "light";

  return (
    <div className="pointer-events-none fixed right-2 bottom-8 z-30 flex flex-col items-center gap-4 sm:right-3 md:right-5 lg:right-7">
      <button
        type="button"
        onClick={onClick}
        className={`pointer-events-auto flex cursor-pointer flex-col items-center gap-4 ${
          onVideo ? "text-white" : "text-jf-ink/55"
        }`}
        aria-label={atEnd ? "Back to the top" : "Scroll to explore"}
      >
        <span
          className={`landing-vertical-label text-xs font-semibold tracking-[0.22em] md:text-sm ${
            onVideo ? "text-white" : "text-jf-ink/45"
          }`}
        >
          {atEnd ? "Back to the top" : "Scroll to explore"}
        </span>
        <ScrollArrow
          size="md"
          className={`${atEnd ? "rotate-180" : ""} ${
            onVideo ? "text-white" : "text-jf-red"
          }`}
        />
      </button>
    </div>
  );
}
