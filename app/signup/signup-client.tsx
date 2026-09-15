"use client";

import { useState, type FormEvent } from "react";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";
import { authLinks } from "@/components/landing/content";
import { signInAsOwner } from "@/lib/auth/session";

export default function SignupPage() {
  const [pending, setPending] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    signInAsOwner({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      companyName: String(form.get("company") ?? ""),
    });
    window.location.assign("/dashboard");
  };

  return (
    <MarketingChrome>
      <section className="px-[6%] pt-28 pb-20 md:px-[10%] md:pt-36 md:pb-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-16">
          <Reveal from="left">
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-red">
                Get started
              </p>
              <h1 className="mt-4 max-w-md text-3xl leading-tight font-semibold text-jf-ink md:text-4xl md:leading-[1.15]">
                Create the owner account for your company.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7">
                You&apos;ll set up the organisation, create projects, and invite
                clerks or foremen. Site staff join later by invitation — they
                don&apos;t sign up here.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-jf-muted">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                  Own the organisation and project records
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                  Invite site teams to specific projects only
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-jf-red" />
                  Keep profit and margin views with ownership
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal from="right" delay={100}>
            <div className="bg-white p-6 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.35)] md:p-10 lg:p-12">
              <form className="space-y-6" onSubmit={onSubmit}>
                <label className="block">
                  <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
                    Full name
                  </span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                <label className="block">
                  <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
                    Company name
                  </span>
                  <input
                    required
                    name="company"
                    autoComplete="organization"
                    className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                <label className="block">
                  <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
                    Work email
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                <label className="block">
                  <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
                    Password
                  </span>
                  <input
                    required
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    minLength={8}
                    className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
                  />
                  <span className="mt-2 block text-xs text-jf-muted">
                    At least 8 characters.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex cursor-pointer items-center gap-3 bg-black px-6 py-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {pending ? "Creating…" : "Create account"}
                </button>

                <div className="border-t border-black/10 pt-6">
                  <p className="text-sm text-jf-muted">
                    Already have an account?
                  </p>
                  <TransitionLink
                    href={authLinks.login.href}
                    className="mt-3 inline-flex border border-black/20 px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-jf-ink uppercase no-underline transition-colors hover:border-black hover:bg-black hover:text-white"
                  >
                    Log in
                  </TransitionLink>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingChrome>
  );
}
