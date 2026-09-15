import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "About us — Jengaflow",
  description:
    "Why we built Jengaflow: one project record for site spending and construction progress.",
};

export default function AboutPage() {
  return (
    <MarketingChrome>
      <section className="relative min-h-[52vh] overflow-hidden bg-jf-ink md:min-h-[62vh]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jf-ink via-jf-ink/40 to-transparent" />
        <div className="relative z-10 flex min-h-[52vh] items-end px-[6%] pb-14 pt-32 md:min-h-[62vh] md:px-[10%] md:pb-20">
          <Reveal from="up">
            <p className="landing-tracked text-xs font-semibold text-white/70">
              About us
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#f3f3f3] px-[6%] py-16 md:px-[10%] md:py-24">
        <div className="absolute bottom-0 left-0 h-24 w-24 bg-jf-red md:h-32 md:w-36" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal from="left">
            <div>
              <h1 className="max-w-xl text-3xl leading-tight font-semibold text-jf-red md:text-5xl md:leading-[1.15]">
                We keep every site on one record.
              </h1>
              <div className="mt-8 max-w-xl space-y-5 text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7">
                <p>
                  Construction projects fail quietly when spending and progress
                  live in different places — WhatsApp threads, notebooks, and
                  phone galleries. By month-end, owners are reconstructing the
                  job instead of managing it.
                </p>
                <p>
                  Jengaflow was built for that gap. Clerks and foremen capture
                  materials, labour, deliveries, vehicles, and progress media on
                  site. Owners see budget, spend breakdown, running profit, and a
                  visual construction diary — without sharing sensitive margin
                  with the site team.
                </p>
                <p>
                  We started with East African contractors and engineers in mind:
                  practical workflows, phone-first capture, and clear ownership of
                  the numbers. The fundamentals stay the same as we grow — one
                  project record, honest roles, and tools that fit how sites
                  actually work.
                </p>
                <p>
                  Ready to put your next site on one record?{" "}
                  <TransitionLink
                    href="/contact"
                    className="font-semibold text-jf-red no-underline hover:underline"
                  >
                    Let&apos;s talk.
                  </TransitionLink>
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal from="right" delay={120}>
            <div className="relative min-h-[280px] md:min-h-[420px]">
              <div className="absolute top-6 left-6 z-0 h-full w-full bg-jf-red md:top-8 md:left-8" />
              <div className="relative z-10 h-full min-h-[280px] overflow-hidden md:min-h-[420px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80)",
                  }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-[6%] py-16 md:px-[10%] md:py-20">
        <Reveal from="up">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.35fr_1fr] md:gap-16">
            <p className="landing-tracked text-xs font-semibold text-jf-ink/40">
              Why teams choose us
            </p>
            <blockquote className="border-l-2 border-jf-red pl-6 text-xl leading-snug font-medium text-jf-ink md:text-2xl md:leading-snug">
              “Owners need two answers every week: how much have we spent, and how
              far has the work reached? Jengaflow connects both inside the
              project.”
              <footer className="mt-6 text-sm font-normal tracking-[0.12em] text-jf-muted uppercase">
                — Product principle
              </footer>
            </blockquote>
          </div>
        </Reveal>
      </section>
    </MarketingChrome>
  );
}
