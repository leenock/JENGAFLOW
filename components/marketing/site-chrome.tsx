"use client";

import { useState } from "react";
import { Logo } from "@/components/landing/logo";
import { navGroups } from "@/components/landing/content";
import { PrimaryNav } from "@/components/landing/primary-nav";
import { TransitionLink } from "./transition-link";
import { AuthMenuActions, AuthNav } from "./auth-nav";
import { SiteFooter } from "./site-footer";

type MarketingChromeProps = {
  children: React.ReactNode;
  /** light = white logo on dark hero; dark = ink logo on light pages */
  tone?: "light" | "dark";
};

export function MarketingChrome({
  children,
  tone = "dark",
}: MarketingChromeProps) {
  const [open, setOpen] = useState(false);
  const logoTone = open || tone === "light" ? "light" : "dark";
  const linkColor = tone === "light" ? "text-white" : "text-jf-ink";

  return (
    <div className="marketing-page min-h-dvh bg-[#f3f3f3] text-jf-ink">
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md ${
          tone === "light"
            ? "border-white/10 bg-jf-ink/90"
            : "border-black/8 bg-white/95"
        }`}
      >
        <div className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-[6%] py-5 md:px-[10%] md:py-6">
          <div className="pointer-events-auto">
            <Logo tone={logoTone} />
          </div>
          <div className="pointer-events-auto hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-8">
              <PrimaryNav tone={tone} />
              <TransitionLink
                href="/contact"
                className={`landing-tracked text-[11px] font-medium no-underline transition-opacity hover:opacity-65 lg:text-xs ${linkColor}`}
              >
                Contact
              </TransitionLink>
            </div>
            <AuthNav tone={tone} />
          </div>
        </div>
      </header>

      <button
        type="button"
        className="pointer-events-auto fixed top-3 right-5 z-[80] flex h-12 w-12 cursor-pointer items-center justify-center bg-white md:top-4 md:right-7 md:h-14 md:w-14"
        aria-expanded={open}
        aria-controls="marketing-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="relative block h-3.5 w-6">
          <span
            className={`absolute top-0 left-0 h-[2px] w-full bg-jf-ink transition-transform duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute top-[6px] left-0 h-[2px] w-[18px] bg-jf-ink transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute top-[12px] left-0 h-[2px] w-full bg-jf-ink transition-transform duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <div
        id="marketing-nav"
        className={`fixed inset-y-0 left-0 z-[60] w-full bg-jf-red transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none -translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <nav className="relative flex h-full flex-col justify-center px-8 md:px-16">
          <ul className="space-y-8 md:space-y-10">
            <li>
              <TransitionLink
                href="/"
                className="block text-3xl font-medium text-white no-underline md:text-5xl"
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
              >
                Home
              </TransitionLink>
            </li>
            {navGroups.map((group, groupIndex) => (
              <li key={group.title ?? `group-${groupIndex}`}>
                {group.title ? (
                  <p className="landing-tracked mb-3 text-[11px] font-medium tracking-[0.18em] text-white/55 uppercase">
                    {group.title}
                  </p>
                ) : null}
                <ul className="space-y-3 md:space-y-4">
                  {group.links
                    .filter((link) => !link.href.startsWith("mailto:"))
                    .map((link) => (
                      <li key={link.href}>
                        <TransitionLink
                          href={link.href}
                          className="block text-3xl font-medium text-white no-underline md:text-5xl"
                          onClick={() => setOpen(false)}
                          tabIndex={open ? 0 : -1}
                        >
                          {link.label}
                        </TransitionLink>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
          <AuthMenuActions open={open} onNavigate={() => setOpen(false)} />
        </nav>
      </div>

      <main>{children}</main>

      <SiteFooter />
    </div>
  );
}
