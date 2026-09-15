"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { authLinks, contact, footerCta } from "./content";

export function LandingFooter({
  screenIndex,
  visible,
  active,
}: {
  screenIndex: number;
  visible: boolean;
  active: boolean;
}) {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <footer
      id="contact-us"
      data-screen={screenIndex}
      data-tone="dark"
      data-visible={visible ? "true" : "false"}
      data-active={active ? "true" : "false"}
      className="landing-screen overflow-y-auto border-t border-white/10 bg-jf-ink px-5 py-10 text-white md:px-12 md:py-12"
    >
      <div className="relative mx-auto flex min-h-full max-w-5xl flex-col justify-center gap-10 py-8 md:gap-12 lg:flex-row lg:items-stretch lg:gap-14">
        <div className="flex flex-1 flex-col justify-center">
          <p
            className="footer-reveal landing-tracked text-[10px] font-medium text-jf-red"
            data-from="up"
            style={{ transitionDelay: active ? "80ms" : "0ms" }}
          >
            {footerCta.eyebrow}
          </p>
          <div
            className="footer-accent-line mt-3 h-0.5 w-12 bg-jf-red"
            style={{ transitionDelay: active ? "160ms" : "0ms" }}
            aria-hidden
          />
          <h2
            className="footer-reveal mt-4 max-w-md text-2xl font-semibold tracking-tight text-white md:text-3xl"
            data-from="up"
            style={{ transitionDelay: active ? "180ms" : "0ms" }}
          >
            {footerCta.title}
          </h2>
          <p
            className="footer-reveal mt-3 max-w-md text-sm leading-relaxed text-white/70"
            data-from="up"
            style={{ transitionDelay: active ? "280ms" : "0ms" }}
          >
            {footerCta.body}
          </p>

          <div
            className="footer-reveal mt-7 flex flex-wrap gap-3"
            data-from="up"
            style={{ transitionDelay: active ? "380ms" : "0ms" }}
          >
            <Link
              href={authLinks.signup.href}
              className="inline-flex cursor-pointer bg-jf-red px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline transition-opacity hover:opacity-90"
            >
              {authLinks.signup.label}
            </Link>
            <Link
              href={authLinks.login.href}
              className="inline-flex cursor-pointer border border-white/30 px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline transition-colors hover:border-white"
            >
              {authLinks.login.label}
            </Link>
          </div>

          <dl
            className="footer-reveal mt-10 space-y-4 border-t border-white/10 pt-8 text-sm"
            data-from="fade"
            style={{ transitionDelay: active ? "480ms" : "0ms" }}
          >
            <div>
              <dt className="landing-tracked text-[10px] font-medium text-white/40">
                Email
              </dt>
              <dd className="mt-1.5">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-white no-underline hover:underline"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="landing-tracked text-[10px] font-medium text-white/40">
                Phone
              </dt>
              <dd className="mt-1.5 text-white/80">{contact.phone}</dd>
            </div>
          </dl>

          <p
            className="footer-reveal mt-8 text-[10px] tracking-[0.08em] text-white/40 uppercase"
            data-from="fade"
            style={{ transitionDelay: active ? "560ms" : "0ms" }}
          >
            © {new Date().getFullYear()} Jengaflow
          </p>
        </div>

        <div
          data-landing-interactive
          className="footer-reveal relative flex w-full flex-1 flex-col justify-center lg:max-w-md"
          data-from="right"
          style={{ transitionDelay: active ? "220ms" : "0ms" }}
        >
          <div className="relative overflow-hidden border border-white/10 bg-white px-5 py-6 text-jf-ink md:px-7 md:py-8">
            <div
              className="footer-corner absolute top-0 left-0 h-2 w-16 bg-jf-red"
              style={{ transitionDelay: active ? "420ms" : "0ms" }}
              aria-hidden
            />
            {sent ? (
              <div className="flex min-h-[220px] flex-col justify-center">
                <p className="text-xl font-semibold text-jf-red">
                  Message sent.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-jf-muted">
                  Thanks — we&apos;ll reply soon. For urgent notes, email{" "}
                  {contact.email}.
                </p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={onSubmit}>
                <div>
                  <p className="landing-tracked text-[10px] font-semibold text-jf-red">
                    Contact
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-jf-ink">
                    {footerCta.formTitle}
                  </h3>
                  <p className="mt-1.5 text-sm text-jf-muted">
                    {footerCta.formBody}
                  </p>
                </div>
                <label className="block">
                  <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                    Name
                  </span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    className="mt-1.5 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                <label className="block">
                  <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="mt-1.5 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                <label className="block">
                  <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                    Message
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={3}
                    className="mt-1.5 w-full resize-y border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer bg-jf-red px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest("[data-landing-interactive]")) return true;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    tag === "BUTTON" ||
    tag === "A"
  );
}

export { isInteractiveTarget };
