"use client";

import { Logo } from "@/components/landing/logo";
import { authLinks, contact } from "@/components/landing/content";
import { TransitionLink } from "./transition-link";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/how-it-works" },
  { label: "Who it's for", href: "/site-teams" },
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const columns = [
  {
    title: "Home",
    links: [
      { label: "The problem", href: "/#problem" },
      { label: "Two questions", href: "/#two-questions" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "What you capture", href: "/#capture" },
      { label: "For site teams", href: "/#site-team" },
      { label: "For owners", href: "/#owners" },
      { label: "Early access", href: "/#early-access" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "What you capture", href: "/capture" },
      { label: "For site teams", href: "/site-teams" },
      { label: "For owners", href: "/owners" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Early access", href: "mailto:hello@jengaflow.com" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: authLinks.signup.label, href: authLinks.signup.href },
      { label: "Email us", href: `mailto:${contact.email}` },
      { label: "Request a demo", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black px-[6%] pt-14 pb-10 text-white md:px-[10%] md:pt-16 md:pb-12">
      <div className="mx-auto max-w-6xl">
        {/* Top: logo + primary nav */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Logo tone="light" />
          <nav aria-label="Footer primary">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end md:gap-x-8">
              {primaryLinks.map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={link.href}
                    className="landing-tracked text-[11px] font-medium text-white no-underline transition-opacity hover:opacity-60 lg:text-xs"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/15" />

        {/* Middle: address + link columns */}
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_repeat(4,1fr)] lg:gap-8">
          <div>
            <p className="text-sm font-semibold text-white">Jengaflow</p>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              {contact.location}
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-3 inline-block text-sm text-white/45 no-underline transition-colors hover:text-white"
            >
              {contact.email}
            </a>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="landing-tracked mb-4 text-[10px] font-semibold text-white/35">
                {column.title}
              </p>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    {link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="text-[13px] text-white/45 no-underline transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <TransitionLink
                        href={link.href}
                        className="text-[13px] text-white/45 no-underline transition-colors hover:text-white"
                      >
                        {link.label}
                      </TransitionLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-[11px] text-white/40 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>© {year} Jengaflow. All Rights Reserved.</p>
            <TransitionLink
              href="/contact"
              className="text-white/40 no-underline transition-colors hover:text-white"
            >
              Terms & conditions
            </TransitionLink>
          </div>
          <p className="landing-tracked text-[10px] tracking-[0.16em] uppercase">
            Construction site tracking
          </p>
        </div>
      </div>
    </footer>
  );
}
