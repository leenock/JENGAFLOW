import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "For site teams — Jengaflow",
  description:
    "Clerks and foremen capture materials, labour, deliveries, and progress in seconds — without seeing owner profit or margin.",
};

const principles = [
  {
    label: "01",
    title: "Phone-first",
    body: "Built for dusty hands and short windows between tasks — not desktop forms that slow the site down.",
  },
  {
    label: "02",
    title: "Project-scoped",
    body: "Staff only see sites they are invited to. A foreman on Site A never wanders into Site B by accident.",
  },
  {
    label: "03",
    title: "Owner-safe",
    body: "Running profit and margin stay hidden. Capture stays operational so the record gets filled in.",
  },
];

const captureItems = [
  {
    title: "Materials",
    body: "Quantity, unit price, and supplier — logged while the delivery is still on site.",
  },
  {
    title: "Labour",
    body: "Payments by worker or crew with role, amount, and payment type.",
  },
  {
    title: "Deliveries",
    body: "What arrived, fees, who received it, and which vehicle brought the load.",
  },
  {
    title: "Progress",
    body: "Photos or short videos with notes like “Slab poured — Block B.”",
  },
];

const dayFlow = [
  {
    step: "01",
    title: "Open My sites",
    body: "Land on assigned projects only — no company-wide finance noise.",
  },
  {
    step: "02",
    title: "Tap Capture",
    body: "Pick Material, Labour, Delivery, or Progress in a few taps.",
  },
  {
    step: "03",
    title: "Save and move on",
    body: "The entry hits the project record for the owner — you’re back to the pour.",
  },
];

const canDo = [
  "Materials, labour, deliveries, and progress media",
  "Vehicles linked to deliveries",
  "Site crew details for workers on the ground",
  "Assigned projects only",
];

const cannotDo = [
  "Running profit or margin",
  "Company-wide spend dashboards",
  "Budget and contract totals",
  "Inviting other staff or exporting CSV",
];

export default function SiteTeamsPage() {
  return (
    <MarketingChrome>
      <section className="relative overflow-hidden bg-[#f3f3f3]">
        <div className="mx-auto grid max-w-6xl gap-10 px-[6%] pt-28 pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14 md:px-[10%] md:pt-36 md:pb-24">
          <Reveal from="left">
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-red">
                Jengaflow for site teams
              </p>
              <h1 className="mt-4 max-w-xl text-3xl leading-tight font-semibold text-jf-ink md:text-5xl md:leading-[1.12]">
                Built for 10–20 seconds on site.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7">
                Clerks and foremen capture materials, labour, deliveries, and
                progress on their phones — so the project record stays current
                where the work happens.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <TransitionLink
                  href="/signup"
                  className="inline-flex bg-jf-red px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase no-underline"
                >
                  Get started
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
                <div className="absolute inset-0 bg-gradient-to-t from-jf-ink/75 via-transparent to-transparent" />
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

      <section className="border-b border-black/8 bg-white px-[6%] py-16 md:px-[10%] md:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <p className="landing-tracked text-xs font-semibold text-jf-ink/45">
              How it feels
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-jf-ink md:text-3xl">
              Designed for the pace of a live site — not a back-office form.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {principles.map((item, index) => (
              <Reveal key={item.title} from="up" delay={index * 90}>
                <article>
                  <p className="landing-tracked text-[11px] font-semibold text-jf-red">
                    {item.label}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-jf-ink">
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
                Daily capture
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-jf-red md:text-3xl">
                Everything the site needs to log — nothing it shouldn&apos;t see.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-jf-muted">
                Four capture types cover the day. Each entry lands on the project
                timeline so owners can follow money and movement together.
              </p>
              <ul className="mt-8 space-y-4">
                {captureItems.map((item) => (
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
              <TransitionLink
                href="/capture"
                className="mt-8 inline-flex text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase no-underline hover:opacity-70"
              >
                What you can record →
              </TransitionLink>
            </div>
          </Reveal>

          <Reveal from="right" delay={120}>
            <div className="relative mx-auto w-full max-w-sm">
              <div
                className="absolute top-4 left-4 h-full w-full bg-jf-red"
                aria-hidden
              />
              <div className="relative z-10 border border-black/10 bg-white p-5 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.45)] md:p-6">
                <p className="landing-tracked text-[10px] font-semibold text-jf-muted">
                  Capture
                </p>
                <p className="mt-2 text-lg font-semibold text-jf-ink">
                  Kilimani Apartments
                </p>
                <p className="mt-1 text-sm text-jf-muted">Nairobi · Active</p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  {["Material", "Labour", "Delivery", "Progress"].map(
                    (label) => (
                      <div
                        key={label}
                        className="border border-black/10 px-3 py-4 text-center text-[11px] font-semibold tracking-[0.12em] text-jf-ink uppercase"
                      >
                        {label}
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-5 border border-black/10 p-4">
                  <p className="landing-tracked text-[9px] text-jf-muted">
                    Last saved
                  </p>
                  <p className="mt-2 text-sm font-medium text-jf-ink">
                    Delivery — 200 bags cement
                  </p>
                  <p className="mt-1 text-xs text-jf-muted">
                    Today · Linked to KBZ 482K
                  </p>
                </div>
                <p className="mt-5 text-[11px] text-jf-muted">
                  Sample phone view — profit stays off this screen.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-[6%] py-16 md:px-[10%] md:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <p className="landing-tracked text-xs font-semibold text-jf-ink/45">
              A typical day
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-jf-ink md:text-3xl">
              From invite to a clean site record in three steps.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {dayFlow.map((item, index) => (
              <Reveal key={item.step} from="up" delay={index * 90}>
                <article className="border-t border-black/10 pt-6">
                  <p className="landing-tracked text-[11px] font-semibold text-jf-red">
                    {item.step}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-jf-ink">
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
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <p className="landing-tracked text-xs font-semibold text-jf-red">
              Access model
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold md:text-3xl">
              Capture stays operational. Numbers stay with ownership.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
            <Reveal from="left" delay={80}>
              <div className="border border-white/15 p-8 md:p-10">
                <p className="landing-tracked text-[10px] font-semibold text-white/50">
                  Site teams can
                </p>
                <ul className="mt-6 space-y-4 text-sm text-white/80">
                  {canDo.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal from="right" delay={120}>
              <div className="border border-white/15 p-8 md:p-10">
                <p className="landing-tracked text-[10px] font-semibold text-white/50">
                  Site teams cannot
                </p>
                <ul className="mt-6 space-y-4 text-sm text-white/80">
                  {cannotDo.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-white/35" />
                      {item}
                    </li>
                  ))}
                </ul>
                <TransitionLink
                  href="/owners"
                  className="mt-8 inline-flex text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline hover:opacity-70"
                >
                  How owners see the full picture →
                </TransitionLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#eef0f0] px-[6%] py-16 md:px-[10%] md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1fr] md:items-center md:gap-16">
          <Reveal from="left">
            <div
              className="min-h-[260px] bg-cover bg-center md:min-h-[340px]"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1400&q=80)",
              }}
            >
              <div className="flex h-full min-h-[260px] items-end bg-gradient-to-t from-jf-ink/75 via-transparent to-transparent p-6 md:min-h-[340px] md:p-8">
                <div>
                  <p className="landing-tracked text-[10px] font-semibold text-white/70">
                    My sites
                  </p>
                  <p className="mt-2 max-w-xs text-lg font-medium text-white">
                    Assigned work only — ready for capture.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal from="right" delay={100}>
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-ink/45">
                After login
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-jf-ink md:text-3xl">
                A workspace built for clerks and foremen — not the owner dashboard.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-jf-muted">
                Staff land on My sites: assigned projects, quick capture, and
                recent activity. No contract totals, no margin, no export
                clutter — just what they need to keep the site record honest.
              </p>
              <TransitionLink
                href="/how-it-works"
                className="mt-8 inline-flex text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase no-underline hover:opacity-70"
              >
                How invites and setup work →
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
                Start a workspace, invite clerks and foremen, and keep capture
                where the work happens.
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
