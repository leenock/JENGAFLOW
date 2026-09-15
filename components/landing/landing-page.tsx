"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chapters } from "./content";
import { ChapterScreens } from "./chapter-section";
import { HeroSection } from "./hero-section";
import { LandingBootLoader } from "./landing-boot";
import {
  LandingFooter,
  isInteractiveTarget,
} from "./landing-footer";
import { Pagination } from "./pagination";
import { ScrollCue } from "./scroll-cue";
import { SiteHeader } from "./site-header";

function chapterIntroScreen(chapterIndex: number) {
  return 1 + chapterIndex * 2;
}

const TRANSITION_MS = 780;
const WHEEL_THRESHOLD = 55;

export function LandingPage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeScreen, setActiveScreen] = useState(0);
  const [leavingScreen, setLeavingScreen] = useState<number | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [booting, setBooting] = useState(true);

  const lockedRef = useRef(false);
  const wheelAccRef = useRef(0);
  const touchYRef = useRef<number | null>(null);

  // Hero + (intro + detail) per chapter + footer
  const totalScreens = 1 + chapters.length * 2 + 1;
  const footerIndex = totalScreens - 1;
  const totalChapters = chapters.length;
  const atEnd = activeScreen >= footerIndex;

  const activeChapter =
    activeScreen === 0 || activeScreen >= footerIndex
      ? activeScreen >= footerIndex
        ? totalChapters
        : 0
      : Math.floor((activeScreen - 1) / 2) + 1;

  const chromeTone: "light" | "dark" =
    activeScreen === footerIndex
      ? "dark"
      : activeScreen === 0 || activeScreen % 2 === 1
        ? "light"
        : "dark";

  const showTopNav = activeScreen === 0 && !navOpen;

  const screenIds = useMemo(() => {
    const ids = ["top"];
    for (const chapter of chapters) {
      ids.push(chapter.id, `${chapter.id}-detail`);
    }
    ids.push("contact-us");
    return ids;
  }, []);

  const isVisible = useCallback(
    (index: number) => index === activeScreen || index === leavingScreen,
    [activeScreen, leavingScreen],
  );

  const goToScreen = useCallback(
    (next: number) => {
      const index = Math.max(0, Math.min(next, totalScreens - 1));
      if (index === activeScreen || lockedRef.current) return;

      lockedRef.current = true;
      setLeavingScreen(activeScreen);
      setActiveScreen(index);
      wheelAccRef.current = 0;

      const id = screenIds[index];
      if (id) {
        window.history.replaceState(null, "", `#${id}`);
      }

      window.setTimeout(() => {
        setLeavingScreen(null);
        lockedRef.current = false;
      }, TRANSITION_MS);
    },
    [activeScreen, screenIds, totalScreens],
  );

  const goToChapter = useCallback(
    (chapterNumber: number) => {
      goToScreen(chapterIntroScreen(chapterNumber - 1));
    },
    [goToScreen],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (event: WheelEvent) => {
      if (booting) {
        event.preventDefault();
        return;
      }
      if (isInteractiveTarget(event.target)) {
        return;
      }
      event.preventDefault();
      if (navOpen || lockedRef.current) return;

      wheelAccRef.current += event.deltaY;
      if (Math.abs(wheelAccRef.current) < WHEEL_THRESHOLD) return;

      const direction = wheelAccRef.current > 0 ? 1 : -1;
      wheelAccRef.current = 0;
      goToScreen(activeScreen + direction);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (booting || isInteractiveTarget(event.target)) {
        touchYRef.current = null;
        return;
      }
      touchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (booting || navOpen || lockedRef.current || touchYRef.current == null)
        return;
      if (isInteractiveTarget(event.target)) return;
      const endY = event.changedTouches[0]?.clientY;
      if (endY == null) return;
      const delta = touchYRef.current - endY;
      touchYRef.current = null;
      if (Math.abs(delta) < 48) return;
      goToScreen(activeScreen + (delta > 0 ? 1 : -1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (booting || navOpen || lockedRef.current) return;
      if (isInteractiveTarget(event.target)) return;
      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        goToScreen(activeScreen + 1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goToScreen(activeScreen - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToScreen(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToScreen(footerIndex);
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeScreen, booting, footerIndex, goToScreen, navOpen]);

  useEffect(() => {
    const onHash = () => {
      const raw = window.location.hash.replace("#", "");
      if (!raw) return;
      const id = raw === "footer" ? "contact-us" : raw;
      const index = screenIds.indexOf(id);
      if (index >= 0) goToScreen(index);
    };

    window.addEventListener("hashchange", onHash);
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, [screenIds, goToScreen]);

  useEffect(() => {
    if (!showTopNav) setNavOpen(false);
  }, [showTopNav]);

  return (
    <div className="landing-root relative h-dvh overflow-hidden bg-black text-white">
      <LandingBootLoader onComplete={() => setBooting(false)} />

      <SiteHeader
        open={navOpen}
        onOpenChange={setNavOpen}
        tone={chromeTone}
        showTopNav={showTopNav && !booting}
      />

      <div ref={stageRef} className="landing-stage">
        <HeroSection
          active={activeScreen === 0}
          visible={isVisible(0)}
          onScrollNext={() => goToScreen(1)}
        />
        {chapters.map((chapter, index) => (
          <ChapterScreens
            key={chapter.id}
            chapter={chapter}
            chapterNumber={index + 1}
            totalChapters={totalChapters}
            introScreenIndex={chapterIntroScreen(index)}
            detailScreenIndex={chapterIntroScreen(index) + 1}
            activeScreenIndex={activeScreen}
            introVisible={isVisible(chapterIntroScreen(index))}
            detailVisible={isVisible(chapterIntroScreen(index) + 1)}
            onSelectChapter={goToChapter}
          />
        ))}

        <LandingFooter
          screenIndex={footerIndex}
          visible={isVisible(footerIndex)}
          active={activeScreen === footerIndex}
        />
      </div>

      {activeScreen > 0 && activeScreen < footerIndex && !booting ? (
        <>
          {chromeTone === "light" ? (
            <Pagination
              total={totalChapters}
              current={activeChapter}
              tone={chromeTone}
              onSelect={goToChapter}
            />
          ) : null}
          <ScrollCue
            atEnd={atEnd}
            tone={chromeTone}
            onClick={() =>
              goToScreen(
                atEnd ? 0 : Math.min(activeScreen + 1, totalScreens - 1),
              )
            }
          />
        </>
      ) : null}

      {activeScreen === footerIndex && !booting ? (
        <ScrollCue
          atEnd
          tone="dark"
          onClick={() => goToScreen(0)}
        />
      ) : null}
    </div>
  );
}
