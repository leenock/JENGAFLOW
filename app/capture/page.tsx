import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "What you capture — Jengaflow",
  description:
    "Materials, labour, deliveries, vehicles, and progress media — recorded where the work happens.",
};

const captureTypes = [
  {
    label: "01",
    title: "Materials",
    body: "Quantity, unit price, supplier, date.",
  },
  {
    label: "02",
    title: "Labour",
    body: "Worker or crew, role, amount, payment type.",
  },
  {
    label: "03",
    title: "Deliveries",
    body: "What arrived, fee, receiver, vehicle.",
  },
  {
    label: "04",
    title: "Vehicles",
    body: "Owned or hired — linked to deliveries.",
  },
  {
    label: "05",
    title: "Progress",
    body: "Photos, videos, short stage notes.",
  },
  {
    label: "06",
    title: "Timeline",
    body: "All entries in one dated project feed.",
  },
];

const outcomes = [
  {
    title: "For site teams",
    body: "Fast phone capture on assigned sites only — no profit screens, no clutter.",
    href: "/site-teams",
    link: "Site-team experience →",
  },
  {
    title: "For owners",
    body: "Structured spend, pulse, and a visual diary fed by what the team logged on site.",
    href: "/owners",
    link: "Owner view →",
  },
];

export default function CapturePage() {
  return (
    <MarketingChrome>
      <section className="grid min-h-[70vh] md:grid-cols-2">
        <Reveal from="left" className="flex h-full">
          <div className="flex flex-1 flex-col justify-center bg-white px-[6%] py-28 md:px-12 lg:px-16 xl:px-20">
            <p className="landing-tracked text-xs font-semibold text-jf-ink">
              What you capture
            </p>
            <h1 className="mt-4 max-w-md text-3xl leading-tight font-semibold text-jf-red md:text-4xl lg:text-[2.6rem]">
              Recorded where the work happens.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7">
              Site teams log the day in minutes. Owners inherit a structured
              project history — not a scavenger hunt through chats.
            </p>
            <TransitionLink
              href="/site-teams"
              className="mt-10 inline-flex max-w-md flex-col gap-3 no-underline"
            >
              <span className="text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase">
                See the site-team experience
              </span>
              <span className="h-px w-full bg-black/20" />
            </TransitionLink>
          </div>
        </Reveal>
        <Reveal from="right" delay={100} className="min-h-[40vh] md:min-h-full">
          <div
            className="relative h-full min-h-[40vh] bg-cover bg-center md:min-h-full"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80)",
            }}
          >
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute bottom-0 left-0 h-20 w-20 bg-jf-red" />
          </div>
        </Reveal>
      </section>

      <section className="border-b border-black/8 bg-white px-[6%] py-16 md:px-[10%] md:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <p className="landing-tracked text-xs font-semibold text-jf-ink/45">
              Capture types
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold text-jf-ink md:text-3xl">
              What gets logged on site.
            </h2>
          </Reveal>

          <ol className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {captureTypes.map((item, index) => (
              <Reveal key={item.title} from="up" delay={index * 50}>
                <li className="border-t border-black/10 pt-5">
                  <p className="landing-tracked text-[11px] font-semibold text-jf-red">
                    {item.label}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-jf-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-jf-muted">
                    {item.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#eef0f0] px-[6%] py-16 md:px-[10%] md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-16">
          <Reveal from="left">
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-ink/45">
                How an entry lands
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-jf-red md:text-3xl">
                From the phone to the owner timeline in one save.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-jf-muted">
                A clerk logs a delivery. A foreman uploads progress photos. Both
                appear on the project — spend updates for owners, the diary
                fills in for construction progress.
              </p>
              <ul className="mt-8 space-y-4 text-sm text-jf-muted">
                <li className="flex gap-3 border-t border-black/10 pt-4">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                  Capture takes seconds on assigned sites only
                </li>
                <li className="flex gap-3 border-t border-black/10 pt-4">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                  Activity feed shows who recorded what and when
                </li>
                <li className="flex gap-3 border-t border-black/10 pt-4">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                  Profit and margin stay off the site-team screens
                </li>
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
                  Project activity
                </p>
                <p className="mt-2 text-lg font-semibold text-jf-ink">
                  Today on site
                </p>
                <ul className="mt-6 divide-y divide-black/8 border border-black/10">
                  {[
                    ["Delivery", "200 bags cement · KBZ 482K"],
                    ["Labour", "Masons — weekly payment"],
                    ["Progress", "First-floor columns — Block A"],
                    ["Material", "12mm rebar · Apex Steel"],
                  ].map(([kind, title]) => (
                    <li key={title} className="px-4 py-3">
                      <p className="landing-tracked text-[9px] font-semibold text-jf-red">
                        {kind}
                      </p>
                      <p className="mt-1 text-sm font-medium text-jf-ink">
                        {title}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[11px] text-jf-muted">
                  Sample feed — live entries come from Capture.
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
              Who it serves
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-jf-ink md:text-3xl">
              Same capture. Different views by role.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            {outcomes.map((item, index) => (
              <Reveal key={item.title} from="up" delay={index * 100}>
                <article className="border-t border-black/10 pt-6">
                  <h3 className="text-xl font-semibold text-jf-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                    {item.body}
                  </p>
                  <TransitionLink
                    href={item.href}
                    className="mt-6 inline-flex text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase no-underline hover:opacity-70"
                  >
                    {item.link}
                  </TransitionLink>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-jf-ink px-[6%] py-16 text-white md:px-[10%] md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1fr] md:items-center md:gap-16">
          <Reveal from="left">
            <div
              className="min-h-[240px] bg-cover bg-center md:min-h-[300px]"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80)",
              }}
            >
              <div className="flex h-full min-h-[240px] items-end bg-gradient-to-t from-jf-ink/80 via-transparent to-transparent p-6 md:min-h-[300px] md:p-8">
                <p className="max-w-xs text-lg font-medium text-white">
                  Progress media turns spend into a visible build story.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal from="right" delay={100}>
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-red">
                Why it matters
              </p>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                Invoices without photos leave owners guessing.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Capturing materials and labour answers the money question.
                Capturing progress answers how far construction has reached.
                Jengaflow keeps both in the same project record.
              </p>
              <TransitionLink
                href="/how-it-works"
                className="mt-8 inline-flex text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline hover:opacity-70"
              >
                How the full loop works →
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
                Start capturing on your next site.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                Set up the project, invite the team, and keep every entry in one
                place from day one.
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
