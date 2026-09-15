"use client";

import Link from "next/link";
import type { SessionUser } from "@/types/domain";
import { roleLabel } from "@/lib/auth/permissions";

type AppTopbarProps = {
  user: SessionUser;
  onMenuClick: () => void;
  onSignOut: () => void;
};

export function AppTopbar({ user, onMenuClick, onSignOut }: AppTopbarProps) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-black/10 bg-[#f4f4f2]/90 px-5 backdrop-blur-md md:h-16 md:px-8 lg:px-10">
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center border border-black/15 bg-white md:hidden"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <span className="relative block h-3 w-4">
          <span className="absolute top-0 left-0 h-px w-full bg-jf-ink" />
          <span className="absolute top-[5px] left-0 h-px w-full bg-jf-ink" />
          <span className="absolute top-[10px] left-0 h-px w-full bg-jf-ink" />
        </span>
      </button>

      <p className="landing-tracked hidden text-[10px] font-medium text-jf-muted md:block">
        {user.companyName}
      </p>

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/workspace/profile"
          className="hidden text-right no-underline sm:block"
        >
          <p className="text-sm font-medium text-jf-ink hover:text-jf-red">
            {user.name}
          </p>
          <p className="text-[11px] text-jf-muted">
            {roleLabel(user.role)} · {user.email}
          </p>
        </Link>
        <Link
          href="/workspace/profile"
          className="grid h-10 w-10 place-items-center border border-black/15 bg-white text-[11px] font-semibold tracking-wide text-jf-ink no-underline transition-colors hover:border-jf-ink"
          aria-label="Edit profile"
        >
          {initials}
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="landing-tracked hidden cursor-pointer border border-black/15 bg-white px-3 py-2 text-[10px] font-semibold text-jf-ink transition-colors hover:border-jf-ink md:inline-flex"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
