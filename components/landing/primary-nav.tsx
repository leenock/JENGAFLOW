"use client";

import { useEffect, useId, useRef, useState } from "react";
import { topNavItems, type NavItem } from "./content";
import { TransitionLink } from "@/components/marketing/transition-link";

type PrimaryNavProps = {
  tone?: "light" | "dark";
  /** When false, hide links (landing hero scroll behavior) */
  visible?: boolean;
  className?: string;
  items?: NavItem[];
};

function NavGroup({
  item,
  tone,
  interactive,
  linkClass,
}: {
  item: Extract<NavItem, { type: "group" }>;
  tone: "light" | "dark";
  interactive: boolean;
  linkClass: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    if (!interactive) return;
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        clearCloseTimer();
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearCloseTimer();
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const panelTone =
    tone === "light"
      ? "border-white/15 bg-jf-ink text-white shadow-lg shadow-black/25"
      : "border-black/8 bg-white text-jf-ink shadow-lg shadow-black/10";

  const childTone =
    tone === "light"
      ? "text-white/90 hover:bg-white/10 hover:text-white"
      : "text-jf-ink/85 hover:bg-black/[0.04] hover:text-jf-ink";

  return (
    <li
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={`${linkClass} inline-flex items-center gap-1.5`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        tabIndex={interactive ? 0 : -1}
        onClick={() => {
          if (!interactive) return;
          clearCloseTimer();
          setOpen((value) => !value);
        }}
      >
        {item.label}
        <span
          aria-hidden
          className={`block border-x-[3.5px] border-t-[4px] border-x-transparent transition-transform duration-200 ${
            tone === "light" ? "border-t-white/80" : "border-t-jf-ink/70"
          } ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* pt-3 keeps a hover bridge so the menu does not close in the gap */}
      <div
        className={`absolute top-full left-1/2 z-20 min-w-[11.5rem] -translate-x-1/2 pt-3 transition-[visibility] duration-200 ${
          open
            ? "visible"
            : "invisible pointer-events-none"
        }`}
      >
        <ul
          id={menuId}
          role="menu"
          className={`border py-2 transition-all duration-200 ${panelTone} ${
            open
              ? "translate-y-0 opacity-100"
              : "-translate-y-1 opacity-0"
          }`}
        >
          {item.children.map((child) => (
            <li key={child.href} role="none">
              <TransitionLink
                href={child.href}
                role="menuitem"
                className={`landing-tracked block px-4 py-2.5 text-[11px] font-medium no-underline lg:text-xs ${childTone}`}
                tabIndex={open && interactive ? 0 : -1}
                onClick={() => {
                  clearCloseTimer();
                  setOpen(false);
                }}
              >
                {child.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function PrimaryNav({
  tone = "dark",
  visible = true,
  className = "",
  items = topNavItems,
}: PrimaryNavProps) {
  const linkColor = tone === "light" ? "text-white" : "text-jf-ink";
  const linkClass = `landing-tracked text-[11px] font-medium no-underline transition-opacity hover:opacity-65 lg:text-xs ${linkColor}`;
  const interactive = visible;

  return (
    <nav
      className={`${className} ${
        visible
          ? "visible translate-y-0 opacity-100"
          : "pointer-events-none invisible -translate-y-2 opacity-0"
      } transition-all duration-300 ease-out`}
      aria-label="Primary"
      aria-hidden={!visible}
    >
      <ul className="flex items-center gap-7 lg:gap-9 xl:gap-11">
        {items.map((item) =>
          item.type === "link" ? (
            <li key={item.href}>
              <TransitionLink
                href={item.href}
                className={linkClass}
                tabIndex={interactive ? 0 : -1}
              >
                {item.label}
              </TransitionLink>
            </li>
          ) : (
            <NavGroup
              key={item.label}
              item={item}
              tone={tone}
              interactive={interactive}
              linkClass={linkClass}
            />
          ),
        )}
      </ul>
    </nav>
  );
}
