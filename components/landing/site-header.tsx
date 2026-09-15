"use client";

import { useEffect } from "react";
import { Logo } from "./logo";
import { navGroups } from "./content";
import { PrimaryNav } from "./primary-nav";
import { TransitionLink } from "@/components/marketing/transition-link";
import { AuthMenuActions, AuthNav } from "@/components/marketing/auth-nav";

type SiteHeaderProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tone?: "light" | "dark";
  /** Full Maman-style top links — visible on hero, hidden after scroll */
  showTopNav?: boolean;
};

export function SiteHeader({
  open,
  onOpenChange,
  tone = "light",
  showTopNav = false,
}: SiteHeaderProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const logoTone = open || tone === "light" ? "light" : "dark";
  const linkColor = tone === "light" ? "text-white" : "text-jf-ink";
  const topNavVisible = showTopNav && !open;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[70]">
        <div className="landing-grid-lines pointer-events-none absolute inset-0 hidden md:block" />

        <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-4 px-[6%] py-6 md:px-[10%] md:py-7">
          <div className="pointer-events-auto z-10 shrink-0">
            <Logo tone={logoTone} compact={topNavVisible} />
          </div>

          <PrimaryNav
            tone={tone}
            visible={topNavVisible}
            className="pointer-events-auto z-10 hidden justify-center md:flex"
          />

          <div className="z-10 flex items-center justify-end gap-4 justify-self-end md:gap-5">
            <div className="hidden items-center gap-4 md:flex lg:gap-5">
              <AuthNav tone={tone} visible={topNavVisible} />
              <TransitionLink
                href="/contact"
                className={`pointer-events-auto landing-tracked text-[11px] font-medium no-underline transition-all duration-300 hover:opacity-65 lg:text-xs ${linkColor} ${
                  topNavVisible
                    ? "visible translate-y-0 opacity-100"
                    : "pointer-events-none invisible -translate-y-2 opacity-0"
                }`}
                tabIndex={topNavVisible ? 0 : -1}
                aria-hidden={!topNavVisible}
              >
                Contact
              </TransitionLink>
            </div>
          </div>
        </div>
      </header>

      <button
        type="button"
        className={`pointer-events-auto fixed top-3 right-5 z-[80] flex h-12 w-12 cursor-pointer items-center justify-center bg-white transition-opacity duration-300 md:top-4 md:right-7 md:h-14 md:w-14 ${
          topNavVisible && !open
            ? "md:pointer-events-none md:opacity-0"
            : "opacity-100"
        }`}
        aria-expanded={open}
        aria-controls="landing-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => onOpenChange(!open)}
        tabIndex={topNavVisible && !open ? -1 : 0}
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
        id="landing-nav"
        className={`fixed inset-y-0 left-0 z-[60] w-full bg-jf-red transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          open
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none -translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 48px, rgba(255,255,255,0.12) 48px, rgba(255,255,255,0.12) 96px)",
          }}
        />
        <nav className="relative flex h-full flex-col justify-center px-8 md:px-16">
          <ul className="space-y-8 md:space-y-10">
            <li
              className={`transition-all duration-500 delay-100 motion-reduce:transition-none ${
                open ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
              }`}
            >
              <TransitionLink
                href="/"
                className="block text-3xl font-medium text-white no-underline transition-opacity hover:opacity-80 md:text-5xl"
                tabIndex={open ? 0 : -1}
                onClick={() => onOpenChange(false)}
              >
                Home
              </TransitionLink>
            </li>
            {navGroups.map((group, groupIndex) => (
              <li
                key={group.title ?? `group-${groupIndex}`}
                className={`transition-all duration-500 motion-reduce:transition-none ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
                }`}
                style={{
                  transitionDelay: open ? `${150 + groupIndex * 70}ms` : "0ms",
                }}
              >
                {group.title ? (
                  <p className="landing-tracked mb-3 text-[11px] font-medium tracking-[0.18em] text-white/55 uppercase">
                    {group.title}
                  </p>
                ) : null}
                <ul className="space-y-3 md:space-y-4">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("mailto:") ? (
                        <a
                          href={link.href}
                          className="block text-3xl font-medium text-white no-underline transition-opacity hover:opacity-80 md:text-5xl"
                          tabIndex={open ? 0 : -1}
                          onClick={() => onOpenChange(false)}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <TransitionLink
                          href={link.href}
                          className="block text-3xl font-medium text-white no-underline transition-opacity hover:opacity-80 md:text-5xl"
                          tabIndex={open ? 0 : -1}
                          onClick={() => onOpenChange(false)}
                        >
                          {link.label}
                        </TransitionLink>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <AuthMenuActions open={open} onNavigate={() => onOpenChange(false)} />
        </nav>
      </div>
    </>
  );
}
