"use client";

import { useState, type FormEvent } from "react";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { contact } from "@/components/landing/content";
import { Reveal } from "@/components/marketing/reveal";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <MarketingChrome>
      <section className="px-[6%] pt-28 pb-8 md:px-[10%] md:pt-36">
        <Reveal from="up">
          <p className="landing-tracked text-xs font-semibold text-jf-red">
            Contact
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold text-jf-ink md:text-5xl">
            Tell us about your sites.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7">
            Early access, demos, or partnership — send a note and we&apos;ll get
            back to you. Built for contractors, engineers, and site managers.
          </p>
        </Reveal>
      </section>

      <section className="grid gap-0 px-[6%] pb-20 md:grid-cols-[0.9fr_1.1fr] md:px-[10%] md:pb-28">
        <Reveal from="left">
          <aside className="border-t border-black/10 py-10 md:border-t-0 md:border-r md:py-0 md:pr-12">
            <dl className="space-y-8">
              <div>
                <dt className="landing-tracked text-[11px] font-semibold text-jf-ink/40">
                  Email
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-lg font-medium text-jf-red no-underline hover:underline"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="landing-tracked text-[11px] font-semibold text-jf-ink/40">
                  Phone
                </dt>
                <dd className="mt-2 text-lg font-medium text-jf-ink">
                  {contact.phone}
                </dd>
              </div>
              <div>
                <dt className="landing-tracked text-[11px] font-semibold text-jf-ink/40">
                  Location
                </dt>
                <dd className="mt-2 max-w-xs text-sm leading-relaxed text-jf-muted">
                  {contact.location}
                </dd>
              </div>
            </dl>
            <div className="mt-12 h-16 w-16 bg-jf-red" aria-hidden />
          </aside>
        </Reveal>

        <Reveal from="right" delay={100}>
          <div className="bg-white p-6 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.35)] md:p-10 lg:p-12">
            {sent ? (
              <div className="flex min-h-[280px] flex-col justify-center">
                <p className="text-2xl font-semibold text-jf-red">Message sent.</p>
                <p className="mt-3 max-w-md text-sm text-jf-muted">
                  Thanks — we&apos;ll reply at the email you provided. For urgent
                  notes, write directly to {contact.email}.
                </p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={onSubmit}>
                <label className="block">
                  <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
                    Name
                  </span>
                  <input
                    required
                    name="name"
                    className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                <label className="block">
                  <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                <label className="block">
                  <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
                    Company / role
                  </span>
                  <input
                    name="company"
                    className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                <label className="block">
                  <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
                    Message
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    className="mt-2 w-full resize-y border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-3 bg-jf-red px-6 py-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </MarketingChrome>
  );
}
