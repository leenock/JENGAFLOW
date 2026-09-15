"use client";

type ScrollArrowProps = {
  className?: string;
  size?: "sm" | "md";
};

export function ScrollArrow({ className = "", size = "md" }: ScrollArrowProps) {
  const dims = size === "sm" ? { w: 16, h: 28 } : { w: 20, h: 34 };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={dims.w}
      height={dims.h}
      viewBox="0 0 20 34"
      aria-hidden
      className={`fill-current ${className}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0v26.2l-8-8.1v5.7L10 34l10-10.2v-5.7l-8 8.1V0H8z"
      />
    </svg>
  );
}
