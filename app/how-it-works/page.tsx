import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "How it works — Jengaflow",
  description:
    "Create the project, add the team, capture the site, review the record.",
};

const steps = [
  {
    n: "01",
    title: "Create the project",
    body: "Set contract value and planned budget. Give every site its own record from day one.",
  },
  {
    n: "02",
    title: "Invite the team",
    body: "Add clerks and foremen to specific projects. They capture — they don’t see running profit.",
  },
  {
    n: "03",
    title: "Capture on site",
    body: "Log materials, labour, deliveries, vehicles, and progress photos in 10–20 seconds.",
  },
  {
    n: "04",
    title: "Review the record",
    body: "Owners monitor spend vs budget, margin, and a dated visual construction diary.",
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingChrome>
      <section className="relative overflow-hidden bg-jf-ink px-[6%] pt-32 pb-20 text-white md:px-[10%] md:pt-40 md:pb-28">
        <div className="landing-grid-lines pointer-events-none absolute inset-0 opacity-40" />
        <Reveal from="up">
          <div className="relative">
            <p className="landing-tracked text-xs font-semibold text-jf-red">
              How it works
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold md:text-5xl md:leading-[1.12]">
              Create the project. Add the team. Capture the site. Review the
              record.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/70 md:text-[15px] md:leading-7">
              A clear loop from setup to daily capture to owner oversight —
              without scattering records across chats and notebooks.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#f3f3f3] px-[6%] py-16 md:px-[10%] md:py-24">
        <ol className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:gap-10">
          {steps.map((step, index) => (
            <Reveal
              key={step.n}
              from={index % 2 === 0 ? "left" : "right"}
              delay={index * 80}
            >
              <li className="relative bg-white p-8 shadow-[0_24px_60px_-48px_rgba(0,0,0,0.4)] md:p-10">
                <span className="text-4xl font-semibold text-jf-ink/15 md:text-5xl">
                  {step.n}
                </span>
                <h2 className="mt-4 text-xl font-semibold text-jf-red">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal from="up" delay={200}>
          <div className="mx-auto mt-14 max-w-6xl">
            <TransitionLink
              href="/contact"
              className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.16em] text-jf-ink uppercase no-underline"
            >
              Request early access
              <span className="h-px w-16 bg-black/25" />
            </TransitionLink>
          </div>
        </Reveal>
      </section>
    </MarketingChrome>
  );
}
