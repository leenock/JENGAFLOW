import { TransitionLink } from "@/components/marketing/transition-link";
import { brand } from "./content";

type LogoProps = {
  tone?: "light" | "dark";
  className?: string;
  /** Tighter mark for the wide Maman-style top bar */
  compact?: boolean;
};

export function Logo({
  tone = "light",
  className = "",
  compact = false,
}: LogoProps) {
  const color = tone === "light" ? "text-white" : "text-jf-ink";

  return (
    <TransitionLink
      href="/"
      className={`inline-flex items-center gap-3 no-underline ${color} ${className}`}
      aria-label={`${brand.name} home`}
    >
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center border-2 border-current"
      >
        <span className="h-4 w-4 border-2 border-current border-t-0 border-l-0" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-semibold tracking-[0.16em] uppercase ${
            compact ? "text-sm md:text-[15px]" : "text-[15px]"
          }`}
        >
          {brand.name}
        </span>
        {!compact ? (
          <span className="mt-1.5 text-[9px] font-medium tracking-[0.22em] uppercase opacity-80">
            {brand.tagline}
          </span>
        ) : (
          <span className="mt-1 text-[8px] font-medium tracking-[0.2em] uppercase opacity-75">
            {brand.tagline}
          </span>
        )}
      </span>
    </TransitionLink>
  );
}
