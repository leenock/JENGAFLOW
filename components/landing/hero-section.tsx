"use client";

import { BackgroundVideo } from "./background-video";
import { hero } from "./content";
import { ScrollArrow } from "./scroll-arrow";

type HeroSectionProps = {
  active: boolean;
  visible: boolean;
  onScrollNext: () => void;
};

export function HeroSection({ active, visible, onScrollNext }: HeroSectionProps) {
  return (
    <section
      id="top"
      data-screen="0"
      data-tone="light"
      data-visible={visible ? "true" : "false"}
      data-active={active ? "true" : "false"}
      className="landing-screen relative flex flex-col bg-black"
      aria-label="Introduction"
      aria-hidden={!visible}
    >
      <div className="absolute inset-0">
        <BackgroundVideo src={hero.video} active={active} />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="landing-grid-lines pointer-events-none absolute inset-0 z-[1]" />

      <div className="relative z-10 mt-auto flex w-full flex-col md:flex-row md:items-stretch">
        <div className="flex flex-1 flex-col justify-center bg-jf-red px-6 py-8 text-white md:px-10 md:py-10 lg:w-[70%] lg:flex-none lg:px-14">
          <p className="landing-tracked mb-3 text-[11px] font-medium opacity-90">
            {hero.baseline}
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            <h1 className="max-w-xl text-[1.45rem] leading-snug font-medium md:text-[1.85rem] lg:max-w-[22rem] lg:text-[2rem] lg:leading-tight">
              {hero.title}
            </h1>
            <div className="hidden w-px shrink-0 self-stretch bg-white/35 lg:block" />
            <p className="max-w-md text-sm leading-relaxed text-white/90 md:text-[15px] md:leading-7 lg:pt-1">
              {hero.body}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onScrollNext}
          className="group relative flex min-h-[5.5rem] cursor-pointer items-center justify-center bg-white px-8 py-6 md:min-h-[auto] md:w-[22%] lg:w-[18%]"
          aria-label={hero.cta}
        >
          <span className="text-center text-sm font-medium text-jf-red">
            {hero.cta}
          </span>
        </button>

        <button
          type="button"
          onClick={onScrollNext}
          className="absolute right-4 bottom-[calc(100%+1.25rem)] hidden cursor-pointer text-white transition-transform duration-300 hover:translate-y-1 md:block"
          aria-label="Scroll down"
        >
          <ScrollArrow />
        </button>
      </div>
    </section>
  );
}
