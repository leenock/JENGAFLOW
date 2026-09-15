import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "For site teams — Jengaflow",
  description:
    "A simple phone interface for clerks and foremen — built for 10–20 seconds on site.",
};

const captureItems = [
  {
    title: "Materials",
    body: "Log quantity, unit price, and supplier while the delivery is still on site.",
  },
  {
    title: "Labour",
    body: "Record payments by worker or team with the date and a short note.",
  },
  {
    title: "Deliveries",
    body: "Note fees, who received the load, and which vehicle brought it.",
  },
  {
    title: "Progress media",
    body: "Upload photos or short videos with captions like “Slab poured — Block B.”",
  },
];

const principles = [
  {
    title: "Phone-first",
    body: "Designed for dusty hands and short windows between tasks — not desktop forms.",
  },
  {
    title: "Project-scoped",
    body: "Staff only see the projects they are invited to. Nothing else leaks across sites.",
  },
  {
    title: "Owner-safe",
    body: "Running profit and margin stay hidden. Capture stays operational, not financial.",
  },
];

export default function SiteTeamsPage() {
  return (
    <MarketingChrome>
      <section className="relative overflow-hidden bg-[#f3f3f3]">
        <div className="mx-auto grid max-w-6xl gap-10 px-[6%] pt-28 pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14 md:px-[10%] md:pt-36 md:pb-24">
          <Reveal from="left">
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-red">
                For site teams
              </p>
              <h1 className="mt-4 max-w-xl text-3xl leading-tight font-semibold text-jf-ink md:text-5xl md:leading-[1.12]">
                Built for 10–20 seconds on site.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7">
                Clerks and foremen capture materials, labour, deliveries, and
                progress updates on their phones. The interface stays simple so
                the record gets filled in where the work actually happens.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <TransitionLink
                  href="/contact"
                  className="inline-flex bg-jf-red px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase no-underline"
                >
                  Request early access
                </TransitionLink>
                <TransitionLink
                  href="/owners"
                  className="inline-flex text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase no-underline hover:opacity-70"
                >
                  See the owner view →
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
                    "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-jf-ink/70 via-transparent to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-6 md:p-8">
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                    On-site capture
                  </p>
                  <p className="mt-2 max-w-xs text-lg font-medium text-white">
                    Fast entries. Clear roles. No clutter.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-black/8 bg-white px-[6%] py-14 md:px-[10%] md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3 md:gap-8">
          {principles.map((item, index) => (
            <Reveal key={item.title} from="up" delay={index * 90}>
              <article>
                <h2 className="text-base font-semibold text-jf-ink">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[#eef0f0] px-[6%] py-16 md:px-[10%] md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <div className="max-w-2xl">
              <p className="landing-tracked text-xs font-semibold text-jf-ink/45">
                Daily capture
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-jf-red md:text-3xl">
                Everything the site needs to log — nothing it shouldn&apos;t see.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-px bg-black/10 sm:grid-cols-2">
            {captureItems.map((item, index) => (
              <Reveal key={item.title} from="up" delay={index * 80}>
                <article className="bg-[#eef0f0] p-8 md:p-10">
                  <h3 className="text-lg font-semibold text-jf-ink">
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

      <section className="bg-jf-ink px-[6%] py-16 text-white md:px-[10%] md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16">
          <Reveal from="left">
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-red">
                Access model
              </p>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                Capture stays operational. Numbers stay with ownership.
              </h2>
            </div>
          </Reveal>
          <Reveal from="right" delay={100}>
            <div className="border border-white/15 p-8 md:p-10">
              <ul className="space-y-5 text-sm leading-relaxed text-white/75">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                  Site staff can add materials, labour, deliveries, vehicles,
                  and progress media.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                  They cannot open running profit, margin, or other sensitive
                  financial summaries.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                  Invites are per project — so a foreman on Site A never sees
                  Site B by accident.
                </li>
              </ul>
              <TransitionLink
                href="/how-it-works"
                className="mt-8 inline-flex text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline hover:opacity-70"
              >
                How project setup works →
              </TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-[6%] py-16 md:px-[10%] md:py-20">
        <Reveal from="up">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-jf-ink md:text-3xl">
                Give your site team a faster way to leave a clean record.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                Join early access and help shape the phone capture experience for
                clerks and foremen.
              </p>
            </div>
            <TransitionLink
              href="/contact"
              className="inline-flex shrink-0 bg-jf-red px-6 py-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase no-underline"
            >
              Talk to us
            </TransitionLink>
          </div>
        </Reveal>
      </section>
    </MarketingChrome>
  );
}
