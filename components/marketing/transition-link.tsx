"use client";

import type { ComponentProps, MouseEvent } from "react";
import Link from "next/link";
import { usePageTransition } from "./page-transition";

type TransitionLinkProps = ComponentProps<typeof Link> & {
  href: string;
};

export function TransitionLink({
  href,
  onClick,
  children,
  ...rest
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    if (href.startsWith("mailto:") || href.startsWith("http")) return;
    event.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
