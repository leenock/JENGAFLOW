"use client";

import { useState, type FormEvent } from "react";
import { MarketingChrome } from "@/components/marketing/site-chrome";
import { TransitionLink } from "@/components/marketing/transition-link";
import { Reveal } from "@/components/marketing/reveal";
import { authLinks } from "@/components/landing/content";
import {
  DEMO_LOGIN_HINTS,
  homePathForRole,
  signInWithEmail,
} from "@/lib/auth/session";

export default function LoginPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const user = signInWithEmail(email);
    if (!user) {
      setPending(false);
      setError(
        "No account for that email. Use a demo owner or invited clerk/foreman email.",
      );
      return;
    }
    window.location.assign(homePathForRole(user.role));
  };

  return (
    <MarketingChrome>
      <section className="px-[6%] pt-28 pb-20 md:px-[10%] md:pt-36 md:pb-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-16">
          <Reveal from="left">
            <div>
              <p className="landing-tracked text-xs font-semibold text-jf-red">
                Log in
              </p>
              <h1 className="mt-4 max-w-md text-3xl leading-tight font-semibold text-jf-ink md:text-4xl md:leading-[1.15]">
                Welcome back to your sites.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-jf-muted md:text-[15px] md:leading-7">
                Owners open the dashboard. Clerks and foremen go straight to
                site capture — without profit or margin views.
              </p>
              <p className="mt-8 text-sm text-jf-muted">
                New here?{" "}
                <TransitionLink
                  href={authLinks.signup.href}
                  className="font-semibold text-jf-red no-underline hover:underline"
                >
                  Create an account
                </TransitionLink>
              </p>
            </div>
          </Reveal>

          <Reveal from="right" delay={100}>
            <div className="bg-white p-6 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.35)] md:p-10 lg:p-12">
              <form className="space-y-6" onSubmit={onSubmit}>
                <label className="block">
                  <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    defaultValue="grace@ridgeview.ke"
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
                    autoComplete="current-password"
                    minLength={8}
                    defaultValue="password"
                    className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
                  />
                </label>
                {error ? (
                  <p className="text-sm text-jf-red" role="alert">
                    {error}
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex cursor-pointer items-center gap-3 bg-black px-6 py-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {pending ? "Signing in…" : "Log in"}
                  </button>
                  <span className="text-xs text-jf-muted">
                    Demo — any password works.
                  </span>
                </div>
              </form>

              <div className="mt-8 border-t border-black/10 pt-6">
                <p className="landing-tracked text-[10px] font-semibold text-jf-muted">
                  Demo accounts
                </p>
                <ul className="mt-3 space-y-2 text-xs text-jf-muted">
                  {DEMO_LOGIN_HINTS.map((hint) => (
                    <li key={hint.email} className="flex flex-wrap gap-x-2">
                      <span className="font-medium text-jf-ink">{hint.email}</span>
                      <span>· {hint.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingChrome>
  );
}
