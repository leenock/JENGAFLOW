"use client";

import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/marketing/transition-link";
import { BackgroundVideo } from "./background-video";
import type { Chapter } from "./content";
import { Pagination } from "./pagination";

type ChapterScreensProps = {
  chapter: Chapter;
  chapterNumber: number;
  totalChapters: number;
  introScreenIndex: number;
  detailScreenIndex: number;
  activeScreenIndex: number;
  introVisible: boolean;
  detailVisible: boolean;
  onSelectChapter: (chapterNumber: number) => void;
};

const WIPE_MS = 760;
const AFTER_WIPE_MS = WIPE_MS - 140;
const SPLIT_MS = 720;

type Anim = {
  panel: string;
  dir: "up" | "down" | "left" | "right";
};

type CardPhase = "out" | "in" | "splitting";

const INTRO_ANIMS: Anim[] = [
  { panel: "curtain-right", dir: "up" },
  { panel: "blind-down", dir: "left" },
  { panel: "iris", dir: "up" },
  { panel: "diagonal", dir: "right" },
  { panel: "curtain-left", dir: "up" },
  { panel: "blind-up", dir: "down" },
  { panel: "zoom", dir: "up" },
];

const DETAIL_ANIMS: Anim[] = [
  { panel: "curtain-left", dir: "up" },
  { panel: "blind-up", dir: "up" },
  { panel: "zoom", dir: "left" },
  { panel: "curtain-right", dir: "up" },
  { panel: "iris", dir: "right" },
  { panel: "diagonal", dir: "up" },
  { panel: "blind-down", dir: "left" },
];

/** Unique enter per chapter */
const CARD_ENTERS = [
  "door-left",
  "flip-up",
  "door-right",
  "expand",
  "slide-up",
  "peel",
  "flip-down",
] as const;

/** Unique split-exit style per chapter */
const CARD_EXITS = [
  "split-x",
  "split-y",
  "split-x-spin",
  "split-y-spin",
  "split-diag",
  "split-x",
  "split-y",
] as const;

/** Alternate card placement like Maman: left / right / center */
const CARD_LAYOUTS = [
  "left",
  "right",
  "center",
  "left",
  "right",
  "center",
  "left",
] as const;

type DetailBodyProps = {
  chapter: Chapter;
  chapterNumber: number;
  totalChapters: number;
  detailActive: boolean;
  detailAnim: Anim;
  onSelectChapter: (chapterNumber: number) => void;
  /** Only the primary half owns aria / interactive focus */
  primary?: boolean;
};

function DetailCardBody({
  chapter,
  chapterNumber,
  totalChapters,
  detailActive,
  detailAnim,
  onSelectChapter,
  primary = true,
}: DetailBodyProps) {
  return (
    <div className="card-face flex w-full bg-white">
      <Pagination
        variant="card"
        total={totalChapters}
        current={chapterNumber}
        tone="dark"
        onSelect={onSelectChapter}
        reveal={detailActive && primary}
      />

      <div className="flex flex-1 flex-col justify-center px-6 py-14 sm:px-10 md:px-12 md:py-16 lg:px-16 xl:px-20">
        <div className="mx-auto w-full max-w-2xl md:ml-[8%] lg:ml-[10%]">
          <p
            id={primary ? `${chapter.id}-detail-title` : undefined}
            className="wipe-content text-sm font-semibold text-jf-ink md:text-base"
            data-dir={detailAnim.dir}
            data-shown={detailActive ? "true" : "false"}
            style={{
              transitionDelay: detailActive ? `${AFTER_WIPE_MS}ms` : "0ms",
            }}
          >
            {chapter.title}
          </p>
          <h2
            className="wipe-content mt-4 max-w-2xl text-[1.65rem] leading-tight font-semibold text-jf-red md:text-3xl lg:text-[2.35rem] lg:leading-[1.2]"
            data-dir={detailAnim.dir}
            data-shown={detailActive ? "true" : "false"}
            style={{
              transitionDelay: detailActive ? `${AFTER_WIPE_MS + 80}ms` : "0ms",
            }}
          >
            {chapter.subtitle}
          </h2>
          <p
            className="wipe-content mt-6 max-w-xl text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7"
            data-dir={detailAnim.dir}
            data-shown={detailActive ? "true" : "false"}
            style={{
              transitionDelay: detailActive ? `${AFTER_WIPE_MS + 160}ms` : "0ms",
            }}
          >
            {chapter.body}
          </p>
          <TransitionLink
            href={chapter.href}
            className="wipe-content mt-10 inline-flex max-w-full flex-col gap-3 no-underline"
            data-dir={detailAnim.dir}
            data-shown={detailActive ? "true" : "false"}
            tabIndex={primary ? undefined : -1}
            aria-hidden={primary ? undefined : true}
            style={{
              transitionDelay: detailActive ? `${AFTER_WIPE_MS + 240}ms` : "0ms",
            }}
          >
            <span className="text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase">
              Discover more about {chapter.title.toLowerCase()}
            </span>
            <span
              className="wipe-line h-px w-full max-w-xl bg-black/20"
              data-shown={detailActive ? "true" : "false"}
              style={{
                transitionDelay: detailActive
                  ? `${AFTER_WIPE_MS + 320}ms`
                  : "0ms",
              }}
            />
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}

export function ChapterScreens({
  chapter,
  chapterNumber,
  totalChapters,
  introScreenIndex,
  detailScreenIndex,
  activeScreenIndex,
  introVisible,
  detailVisible,
  onSelectChapter,
}: ChapterScreensProps) {
  const introActive = activeScreenIndex === introScreenIndex;
  const detailActive = activeScreenIndex === detailScreenIndex;

  const variantIndex = (chapterNumber - 1) % INTRO_ANIMS.length;
  const introAnim = INTRO_ANIMS[variantIndex];
  const detailAnim = DETAIL_ANIMS[variantIndex];
  const cardEnter = CARD_ENTERS[variantIndex];
  const cardExit = CARD_EXITS[variantIndex];
  const cardLayout = CARD_LAYOUTS[variantIndex];

  const [phase, setPhase] = useState<CardPhase>("out");
  const prevActive = useRef(false);

  useEffect(() => {
    const wasActive = prevActive.current;
    prevActive.current = detailActive;

    if (detailActive) {
      setPhase("in");
      return;
    }

    if (wasActive && !detailActive) {
      setPhase("splitting");
      const timer = window.setTimeout(() => setPhase("out"), SPLIT_MS);
      return () => window.clearTimeout(timer);
    }
  }, [detailActive]);

  const contentShown = phase === "in";

  return (
    <>
      <section
        id={chapter.id}
        data-screen={introScreenIndex}
        data-tone="light"
        data-chapter={chapterNumber}
        data-visible={introVisible ? "true" : "false"}
        data-active={introActive ? "true" : "false"}
        className="landing-screen relative overflow-hidden bg-black"
        aria-labelledby={`${chapter.id}-intro-title`}
        aria-hidden={!introVisible}
      >
        <div className="absolute inset-0">
          <BackgroundVideo src={chapter.video} active={introActive} />
          <div className="absolute inset-0 bg-black/55" />
          <div
            className="wipe-panel bg-jf-ink"
            data-anim={introAnim.panel}
            data-revealed={introActive ? "true" : "false"}
            aria-hidden
          />
        </div>
        <div className="landing-grid-lines pointer-events-none absolute inset-0 z-[6]" />

        <div className="relative z-10 flex min-h-dvh items-center px-6 pl-12 sm:pl-14 md:px-[12%] md:pl-[14%] lg:px-[14%]">
          <div className="max-w-3xl">
            <p
              className="wipe-content mb-4 text-sm font-semibold text-jf-red md:text-base"
              data-dir={introAnim.dir}
              data-shown={introActive ? "true" : "false"}
              style={{ transitionDelay: introActive ? `${AFTER_WIPE_MS}ms` : "0ms" }}
            >
              {chapter.title}
            </p>
            <h2
              id={`${chapter.id}-intro-title`}
              className="wipe-content text-[1.75rem] leading-tight font-medium text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
              data-dir={introAnim.dir}
              data-shown={introActive ? "true" : "false"}
              style={{
                transitionDelay: introActive ? `${AFTER_WIPE_MS + 90}ms` : "0ms",
              }}
            >
              {chapter.subtitle}
            </h2>
          </div>
        </div>
      </section>

      <section
        id={`${chapter.id}-detail`}
        data-screen={detailScreenIndex}
        data-tone="dark"
        data-chapter={chapterNumber}
        data-visible={detailVisible ? "true" : "false"}
        data-active={detailActive ? "true" : "false"}
        className="landing-screen relative overflow-hidden bg-[#eef0f0]"
        aria-labelledby={`${chapter.id}-detail-title`}
        aria-hidden={!detailVisible}
      >
        <div
          className={`detail-visual absolute z-0 overflow-hidden ${
            cardLayout === "right"
              ? "inset-x-0 top-[56%] bottom-0 md:inset-y-0 md:left-0 md:right-auto md:top-0 md:w-[48%] lg:w-[46%]"
              : cardLayout === "center"
                ? "inset-0"
                : "inset-x-0 top-[56%] bottom-0 md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[48%] lg:w-[46%]"
          }`}
          data-shifted={contentShown ? "true" : "false"}
          data-layout={cardLayout}
        >
          <BackgroundVideo
            src={chapter.video}
            active={detailActive || phase === "splitting"}
          />
          <div className="absolute inset-0 bg-black/10" />
          <div
            className="wipe-panel bg-jf-red"
            data-anim={detailAnim.panel}
            data-revealed={contentShown ? "true" : "false"}
            aria-hidden
          />
        </div>

        <div
          className={`card-stage relative z-10 flex min-h-dvh items-start px-0 pb-[46%] pt-24 md:items-center md:pb-10 md:pt-28 ${
            cardLayout === "right"
              ? "md:justify-end"
              : cardLayout === "center"
                ? "md:justify-center"
                : "md:justify-start"
          }`}
          data-layout={cardLayout}
        >
          <div
            className={`card-split w-full md:max-h-[calc(100dvh-9.5rem)] md:w-[78%] lg:w-[74%] ${
              cardLayout === "right"
                ? "md:mr-[5%] lg:mr-[6%]"
                : cardLayout === "center"
                  ? "md:w-[70%] lg:w-[66%]"
                  : "md:ml-[5%] lg:ml-[6%]"
            }`}
            data-phase={phase}
            data-enter={cardEnter}
            data-exit={cardExit}
            data-layout={cardLayout}
          >
            <div className="card-half card-half--a" aria-hidden={phase !== "in"}>
              <DetailCardBody
                chapter={chapter}
                chapterNumber={chapterNumber}
                totalChapters={totalChapters}
                detailActive={contentShown}
                detailAnim={detailAnim}
                onSelectChapter={onSelectChapter}
                primary
              />
            </div>
            <div className="card-half card-half--b" aria-hidden>
              <DetailCardBody
                chapter={chapter}
                chapterNumber={chapterNumber}
                totalChapters={totalChapters}
                detailActive={contentShown}
                detailAnim={detailAnim}
                onSelectChapter={onSelectChapter}
                primary={false}
              />
            </div>
          </div>
        </div>

        <div
          className={`corner-reveal absolute bottom-0 z-20 h-16 w-16 bg-jf-red md:h-24 md:w-24 ${
            cardLayout === "right" ? "right-0" : "left-0"
          }`}
          data-shown={contentShown ? "true" : "false"}
          style={{
            transitionDelay: contentShown ? `${AFTER_WIPE_MS + 180}ms` : "0ms",
            transformOrigin: cardLayout === "right" ? "bottom right" : "bottom left",
          }}
          aria-hidden
        />
      </section>
    </>
  );
}
