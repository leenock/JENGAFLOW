import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "For owners — Jengaflow",
  description:
    "See how much you’ve spent and how far construction has reached — budget, profit, and the site diary in one project record.",
};

const questions = [
  {
    label: "01",
    title: "How much have we spent?",
    body: "Contract value, budget, materials, labour, and delivery fees roll into one spend view — with remaining budget and running profit reserved for owners.",
  },
  {
    label: "02",
    title: "How far has the work reached?",
    body: "A dated construction diary with photos and videos shows what was actually built — not just what was paid for.",
  },
];

const capabilities = [
  {
    title: "Project pulse",
    body: "Spend versus physical progress on one screen, so overruns and under-reporting stand out early.",
  },
  {
    title: "Cost breakdown",
    body: "See where money went across materials, labour, and deliveries — without opening a spreadsheet.",
  },
  {
    title: "Team & crew",
    body: "Invite clerks and foremen for capture. Keep site workers and pay basis on the crew list — separate from app logins.",
  },
  {
    title: "Export-ready history",
    body: "Download project records for internal reporting, billing support, or month-end reviews.",
  },
];

const ownerOnly = [
  "Contract value, budget, and remaining budget",
  "Running profit and margin",
  "Company-wide spend across sites",
  "Team invites and export",
];

export default function OwnersPage() {
  return (
    <MarketingChrome>
      <section className="relative overflow-hidden bg-[#f3f3f3]">
        <div className="mx-auto grid max-w-6xl gap-10 px-[6%] pt-28 pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14 md:px-[10%] md:pt-36 md:pb-24">
          <Reveal from="left">
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-red">
                Jengaflow for owners
              </p>
              <h1 className="mt-4 max-w-xl text-3xl leading-tight font-semibold text-jf-ink md:text-5xl md:leading-[1.12]">
                Money and movement in one project record.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7">
                Track budget and spend alongside a visual construction diary —
                without sharing profit with the site team.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <TransitionLink
                  href="/signup"
                  className="inline-flex bg-jf-red px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase no-underline"
                >
                  Get started
                </TransitionLink>
                <TransitionLink
                  href="/site-teams"
                  className="inline-flex text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase no-underline hover:opacity-70"
                >
                  See site-team capture →
                </TransitionLink>
              </div>
            </div>
          </Reveal>

          <Reveal from="right" delay={120}>
            <div className="relative min-h-[320px] md:min-h-[440px]">
              <div
                className="absolute top-5 left-5 h-full w-full bg-jf-red md:top-7 md:left-7"
                aria-hidden
              />
              <div
                className="relative z-10 h-full min-h-[320px] bg-cover bg-center md:min-h-[440px]"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=80)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-jf-ink/75 via-transparent to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-6 md:p-8">
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                    Owner view
                  </p>
                  <p className="mt-2 max-w-xs text-lg font-medium text-white">
                    Spend, progress, and the site diary — together.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-black/8 bg-white px-[6%] py-16 md:px-[10%] md:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <p className="landing-tracked text-xs font-semibold text-jf-ink/45">
              Two questions
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-jf-ink md:text-3xl">
              Every owner needs the same answers — Jengaflow connects both.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            {questions.map((item, index) => (
              <Reveal key={item.title} from="up" delay={index * 100}>
                <article>
                  <p className="landing-tracked text-[11px] font-semibold text-jf-red">
                    {item.label}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-jf-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eef0f0] px-[6%] py-16 md:px-[10%] md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-16">
          <Reveal from="left">
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-ink/45">
                Owner workspace
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-jf-red md:text-3xl">
                Pulse, breakdown, and diary — without leaving the project.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-jf-muted">
                Open a site and see financial health next to physical progress.
                Drill into costs, scroll the timeline, then export when you need
                a clean record.
              </p>
              <ul className="mt-8 space-y-4">
                {capabilities.map((item) => (
                  <li key={item.title} className="border-t border-black/10 pt-4">
                    <p className="text-sm font-semibold text-jf-ink">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-jf-muted">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal from="right" delay={120}>
            <div className="relative">
              <div
                className="absolute top-4 left-4 h-full w-full bg-jf-red md:top-6 md:left-6"
                aria-hidden
              />
              <div className="relative z-10 border border-black/10 bg-white p-5 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.45)] md:p-7">
                <p className="landing-tracked text-[10px] font-semibold text-jf-muted">
                  Project pulse
                </p>
                <p className="mt-2 text-lg font-semibold text-jf-ink">
                  Kilimani Apartments
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="border border-black/10 p-3">
                    <p className="landing-tracked text-[9px] text-jf-muted">
                      Budget used
                    </p>
                    <p className="mt-2 text-xl font-semibold tabular-nums text-jf-ink">
                      48%
                    </p>
                  </div>
                  <div className="border border-black/10 p-3">
                    <p className="landing-tracked text-[9px] text-jf-muted">
                      Built
                    </p>
                    <p className="mt-2 text-xl font-semibold tabular-nums text-jf-ink">
                      42%
                    </p>
                  </div>
                </div>
                <div className="mt-4 border border-black/10 p-3">
                  <p className="landing-tracked text-[9px] text-jf-muted">
                    Spend vs progress
                  </p>
                  <p className="mt-2 text-sm font-medium text-jf-ink">
                    Healthy — spend is tracking with construction.
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    ["Materials", "52%"],
                    ["Labour", "31%"],
                    ["Deliveries", "17%"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-t border-black/8 pt-2 text-sm"
                    >
                      <span className="text-jf-muted">{label}</span>
                      <span className="font-semibold tabular-nums text-jf-ink">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[11px] text-jf-muted">
                  Sample view — live numbers come from site capture.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-[6%] py-16 md:px-[10%] md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
          <Reveal from="left">
            <div
              className="min-h-[280px] bg-cover bg-center md:min-h-[360px]"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80)",
              }}
            >
              <div className="flex h-full min-h-[280px] items-end bg-gradient-to-t from-jf-ink/75 via-transparent to-transparent p-6 md:min-h-[360px] md:p-8">
                <div>
                  <p className="landing-tracked text-[10px] font-semibold text-white/70">
                    Construction diary
                  </p>
                  <p className="mt-2 max-w-xs text-lg font-medium text-white">
                    Foundation complete — Block A
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal from="right" delay={100}>
            <div className="flex flex-col justify-center">
              <p className="landing-tracked text-xs font-semibold text-jf-ink/45">
                Visual progress
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-jf-ink md:text-3xl">
                Proof of progress, not just invoices.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-jf-muted">
                Photos and short videos sit on a dated timeline with the person
                who uploaded them. Link a delivery to an update and connect what
                arrived with what got built.
              </p>
              <TransitionLink
                href="/how-it-works"
                className="mt-8 inline-flex text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase no-underline hover:opacity-70"
              >
                How the record builds →
              </TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-jf-ink px-[6%] py-16 text-white md:px-[10%] md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16">
          <Reveal from="left">
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-red">
                Owner-only
              </p>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                Sensitive numbers stay with you.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Clerks and foremen capture the site. They never see running
                profit or margin — so the record stays complete without exposing
                the business.
              </p>
            </div>
          </Reveal>
          <Reveal from="right" delay={100}>
            <ul className="space-y-4 border border-white/15 p-8 md:p-10">
              {ownerOnly.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                  {item}
                </li>
              ))}
              <li className="pt-2">
                <TransitionLink
                  href="/site-teams"
                  className="inline-flex text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline hover:opacity-70"
                >
                  How capture stays simple →
                </TransitionLink>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-[6%] py-16 md:px-[10%] md:py-20">
        <Reveal from="up">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-jf-ink md:text-3xl">
                Put every site on one clear record.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                Start a workspace, invite your team, and follow spend and
                construction progress from the same place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <TransitionLink
                href="/signup"
                className="inline-flex bg-jf-red px-6 py-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase no-underline"
              >
                Get started
              </TransitionLink>
              <TransitionLink
                href="/contact"
                className="inline-flex border border-black/20 px-6 py-3 text-[11px] font-semibold tracking-[0.16em] text-jf-ink uppercase no-underline hover:border-jf-ink"
              >
                Talk to us
              </TransitionLink>
            </div>
          </div>
        </Reveal>
      </section>
    </MarketingChrome>
  );
}
