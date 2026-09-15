import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "How it works — Jengaflow",
  description:
    "Create the project, invite the team, capture on site, review spend and progress — one clear loop.",
};

const steps = [
  {
    n: "01",
    title: "Create the project",
    body: "Name, location, client, contract value, and budget. One record per site from day one.",
    points: ["Contract & budget", "Start date & status", "Ready for invites"],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Modern building under construction against the sky",
  },
  {
    n: "02",
    title: "Invite the team",
    body: "Add clerks and foremen to specific projects. They capture — they don’t see profit.",
    points: ["Role-based access", "Per-project invites", "Owner-safe numbers"],
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Construction workers collaborating on a building site",
  },
  {
    n: "03",
    title: "Capture on site",
    body: "Materials, labour, deliveries, vehicles, and progress — in 10–20 seconds on a phone.",
    points: ["Phone-first entry", "Assigned sites only", "Dated activity feed"],
    image:
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Crane and structure on an active construction site",
  },
  {
    n: "04",
    title: "Review the record",
    body: "Owners track spend vs budget, pulse, and a visual construction diary — then export.",
    points: ["Pulse & breakdown", "Progress timeline", "CSV export"],
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Construction site overview showing active building work",
  },
];

const outcomes = [
  {
    title: "Spend stays visible",
    body: "Materials, labour, and delivery fees roll into budget and remaining spend.",
    image:
      "https://images.unsplash.com/photo-1531834685032-c34bf7958eed?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Progress stays visible",
    body: "Photos and notes build a dated diary of what was actually built.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Roles stay clear",
    body: "Site teams capture. Owners see the full picture — including margin.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80",
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingChrome>
      <section className="relative overflow-hidden bg-[#f3f3f3]">
        <div className="mx-auto grid max-w-6xl gap-10 px-[6%] pt-28 pb-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14 md:px-[10%] md:pt-36 md:pb-24">
          <Reveal from="left">
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-red">
                How Jengaflow works
              </p>
              <h1 className="mt-4 max-w-xl text-3xl leading-tight font-semibold text-jf-ink md:text-5xl md:leading-[1.12]">
                Create. Invite. Capture. Review.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7">
                One loop from project setup to daily site capture to owner
                oversight — without scattering records across chats and
                notebooks.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <TransitionLink
                  href="/signup"
                  className="inline-flex bg-jf-red px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase no-underline"
                >
                  Get started
                </TransitionLink>
                <TransitionLink
                  href="/capture"
                  className="inline-flex text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase no-underline hover:opacity-70"
                >
                  What you capture →
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
                    "url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80)",
                }}
                role="img"
                aria-label="Active construction site with scaffolding and building structure"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-jf-ink/75 via-transparent to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-6 md:p-8">
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                    The loop
                  </p>
                  <p className="mt-2 max-w-xs text-lg font-medium text-white">
                    Setup → team → capture → oversight.
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
              Four steps
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold text-jf-ink md:text-3xl">
              From empty site to a living project record.
            </h2>
          </Reveal>

          <ol className="mt-14 space-y-16 md:space-y-20">
            {steps.map((step, index) => {
              const imageLeft = index % 2 === 1;
              return (
                <Reveal key={step.n} from="up" delay={index * 60}>
                  <li
                    className={`grid items-center gap-8 md:gap-12 ${
                      imageLeft
                        ? "md:grid-cols-[0.95fr_1.05fr]"
                        : "md:grid-cols-[1.05fr_0.95fr]"
                    }`}
                  >
                    <div className={imageLeft ? "md:order-2" : undefined}>
                      <p className="landing-tracked text-[11px] font-semibold text-jf-red">
                        {step.n}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold text-jf-ink md:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-jf-muted">
                        {step.body}
                      </p>
                      <ul className="mt-6 space-y-2 text-sm text-jf-ink/75">
                        {step.points.map((point) => (
                          <li key={point} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-jf-red" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className={`relative min-h-[220px] md:min-h-[300px] ${
                        imageLeft ? "md:order-1" : ""
                      }`}
                    >
                      <div
                        className={`absolute h-full w-full bg-jf-red ${
                          imageLeft
                            ? "top-3 right-3 md:top-4 md:right-4"
                            : "top-3 left-3 md:top-4 md:left-4"
                        }`}
                        aria-hidden
                      />
                      <div
                        className="relative z-10 h-full min-h-[220px] bg-cover bg-center md:min-h-[300px]"
                        style={{ backgroundImage: `url(${step.image})` }}
                        role="img"
                        aria-label={step.imageAlt}
                      />
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-[#eef0f0] px-[6%] py-16 md:px-[10%] md:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <p className="landing-tracked text-xs font-semibold text-jf-ink/45">
              What you get
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold text-jf-ink md:text-3xl">
              Money and movement, connected.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
            {outcomes.map((item, index) => (
              <Reveal key={item.title} from="up" delay={index * 80}>
                <article>
                  <div
                    className="min-h-[180px] bg-cover bg-center md:min-h-[220px]"
                    style={{ backgroundImage: `url(${item.image})` }}
                    role="img"
                    aria-label={item.title}
                  />
                  <h3 className="mt-5 text-lg font-semibold text-jf-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-jf-muted">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-jf-ink px-[6%] py-16 text-white md:px-[10%] md:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 md:gap-8">
          <Reveal from="left">
            <article className="relative min-h-[320px] overflow-hidden md:min-h-[380px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80)",
                }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jf-ink via-jf-ink/70 to-jf-ink/20" />
              <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end p-8 md:min-h-[380px] md:p-10">
                <p className="landing-tracked text-[10px] font-semibold text-jf-red">
                  Site teams
                </p>
                <h2 className="mt-3 text-xl font-semibold md:text-2xl">
                  Capture fast. Stay scoped.
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                  Clerks and foremen log the day on assigned sites — without
                  seeing running profit or margin.
                </p>
                <TransitionLink
                  href="/site-teams"
                  className="mt-6 inline-flex text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline hover:opacity-70"
                >
                  For site teams →
                </TransitionLink>
              </div>
            </article>
          </Reveal>
          <Reveal from="right" delay={100}>
            <article className="relative min-h-[320px] overflow-hidden md:min-h-[380px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80)",
                }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jf-ink via-jf-ink/70 to-jf-ink/20" />
              <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end p-8 md:min-h-[380px] md:p-10">
                <p className="landing-tracked text-[10px] font-semibold text-jf-red">
                  Owners
                </p>
                <h2 className="mt-3 text-xl font-semibold md:text-2xl">
                  Oversight without the scavenger hunt.
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                  Budget, spend, pulse, and the construction diary — fed by what
                  the team captured on site.
                </p>
                <TransitionLink
                  href="/owners"
                  className="mt-6 inline-flex text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline hover:opacity-70"
                >
                  For owners →
                </TransitionLink>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80)",
          }}
          aria-hidden
        />
        <div className="relative px-[6%] py-16 md:px-[10%] md:py-20">
          <Reveal from="up">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold text-jf-ink md:text-3xl">
                  Put your next site on one record.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                  Start a workspace, invite the team, and keep spend and progress
                  in the same place.
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
                  className="inline-flex border border-black/20 bg-white px-6 py-3 text-[11px] font-semibold tracking-[0.16em] text-jf-ink uppercase no-underline hover:border-jf-ink"
                >
                  Talk to us
                </TransitionLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingChrome>
  );
}
