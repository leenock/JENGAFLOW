"use client";

import { authLinks } from "@/components/landing/content";
import { TransitionLink } from "./transition-link";

type AuthNavProps = {
  tone?: "light" | "dark";
  /** Hide until hero top-nav is shown (landing only) */
  visible?: boolean;
  className?: string;
};

export function AuthNav({
  visible = true,
  className = "",
}: AuthNavProps) {
  return (
    <div
      className={`pointer-events-auto flex items-center ${className} ${
        visible
          ? "visible translate-y-0 opacity-100"
          : "pointer-events-none invisible -translate-y-2 opacity-0"
      } transition-all duration-300 ease-out`}
      aria-hidden={!visible}
    >
      <TransitionLink
        href={authLinks.signup.href}
        className="landing-tracked inline-flex bg-black px-3.5 py-2 text-[11px] font-semibold tracking-[0.14em] text-white uppercase no-underline transition-colors hover:bg-black/80 lg:text-xs"
        tabIndex={visible ? 0 : -1}
      >
        {authLinks.signup.label}
      </TransitionLink>
    </div>
  );
}

type AuthMenuActionsProps = {
  open: boolean;
  onNavigate?: () => void;
};

export function AuthMenuActions({ open, onNavigate }: AuthMenuActionsProps) {
  return (
    <div
      className={`mt-12 flex flex-wrap items-center gap-4 transition-all duration-500 delay-300 motion-reduce:transition-none ${
        open ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
      }`}
    >
      <TransitionLink
        href={authLinks.signup.href}
        className="inline-flex bg-black px-5 py-3 text-sm font-semibold tracking-[0.14em] text-white uppercase no-underline transition-opacity hover:opacity-90"
        tabIndex={open ? 0 : -1}
        onClick={onNavigate}
      >
        {authLinks.signup.label}
      </TransitionLink>
    </div>
  );
}
