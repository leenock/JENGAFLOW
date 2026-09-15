import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "For owners — Jengaflow",
  description:
    "One dashboard for budget, spend breakdown, running profit, and the construction diary.",
};

const panels = [
  {
    title: "Budget & spend",
    body: "Contract value, planned budget, and total spending in one place.",
  },
  {
    title: "Cost breakdown",
    body: "Materials, labour, and deliveries — so you see where the money went.",
  },
  {
    title: "Running profit",
    body: "Margin views stay with owners — not exposed to site capture roles.",
  },
  {
    title: "Construction diary",
    body: "A dated visual timeline of how the building actually developed.",
  },
];

export default function OwnersPage() {
  return (
    <MarketingChrome>
      <section className="px-[6%] pt-28 pb-12 md:px-[10%] md:pt-36 md:pb-16">
        <Reveal from="up">
          <div className="mx-auto max-w-6xl md:ml-[8%]">
            <p className="landing-tracked text-xs font-semibold text-jf-ink">
              For owners
            </p>
            <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold text-jf-red md:text-5xl md:leading-[1.12]">
              One dashboard for money and movement.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7">
              Compare spend to budget, understand running profit, and scroll a
              visual timeline of progress — then export records for reporting or
              billing support.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="px-[6%] pb-20 md:px-[10%] md:pb-28">
        <div className="mx-auto grid max-w-6xl gap-4 md:ml-[8%] md:grid-cols-2">
          {panels.map((panel, index) => (
            <Reveal
              key={panel.title}
              from={index % 2 === 0 ? "left" : "right"}
              delay={index * 90}
            >
              <article
                className={`bg-white p-8 md:p-10 ${
                  index % 2 === 0 ? "md:translate-y-0" : "md:translate-y-8"
                }`}
              >
                <h2 className="text-lg font-semibold text-jf-ink">
                  {panel.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                  {panel.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal from="up" delay={200}>
          <div className="mx-auto mt-14 max-w-6xl md:ml-[8%]">
            <TransitionLink
              href="/contact"
              className="inline-flex flex-col gap-3 no-underline"
            >
              <span className="text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase">
                Get early access
              </span>
              <span className="h-px w-48 bg-black/20" />
            </TransitionLink>
          </div>
        </Reveal>
      </section>
    </MarketingChrome>
  );
}
