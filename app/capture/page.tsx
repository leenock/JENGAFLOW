import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "What you capture — Jengaflow",
  description:
    "Materials, labour, deliveries, vehicles, and progress media — recorded where the work happens.",
};

const items = [
  {
    title: "Materials",
    body: "Quantity, unit price, supplier, and notes — tied to the project spend.",
  },
  {
    title: "Labour",
    body: "Payments by worker or team, with date and context for payroll clarity.",
  },
  {
    title: "Deliveries",
    body: "Fees, receiving person, and the vehicle that brought the load.",
  },
  {
    title: "Vehicles",
    body: "Register site transport once; link deliveries and activity to it.",
  },
  {
    title: "Progress media",
    body: "Photos and short videos with captions like “Foundation completed — Block A.”",
  },
  {
    title: "Daily context",
    body: "Everything lands in one timeline so owners see money and movement together.",
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

      <section className="bg-[#eef0f0] px-[6%] py-16 md:px-[10%] md:py-20">
        <div className="mx-auto grid max-w-6xl gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.title} from="up" delay={index * 70}>
              <article className="bg-[#eef0f0] p-8 md:p-10">
                <h2 className="text-lg font-semibold text-jf-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </MarketingChrome>
  );
}
