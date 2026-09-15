"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { SessionUser } from "@/types/domain";
import { roleLabel } from "@/lib/auth/permissions";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

const SUGGESTIONS = [
  "How do I invite a clerk?",
  "Where do I record a delivery?",
  "Why can’t I see profit?",
  "Where is my sites dashboard?",
] as const;

const ANIM_MS = 280;

function createId() {
  return `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function buildReply(question: string, user: SessionUser): string {
  const q = question.toLowerCase();
  const role = roleLabel(user.role);

  if (
    q.includes("invite") ||
    q.includes("clerk") ||
    q.includes("foreman") ||
    q.includes("team") ||
    q.includes("people")
  ) {
    if (user.role !== "owner") {
      return `As a ${role}, you can’t invite staff yourself. Ask your owner to open People (or a project’s Team tab) and send an invite to the right email.\n\nQuick check — which site should that person capture on?`;
    }
    return `To invite a clerk or foreman:\n1. Open People in the sidebar, or a project’s Team tab.\n2. Enter their name, email, and role.\n3. Assign them to one or more projects.\n\nThey sign in with that email (demo: any password).\n\nShould I walk you through People, or inviting from inside a single project?`;
  }

  if (
    q.includes("delivery") ||
    q.includes("vehicle") ||
    q.includes("arrived")
  ) {
    return `Deliveries live under each project → Deliveries, or in Capture on site.\nRecord what arrived, qty, fee, who received it, and optionally link a vehicle.\n\nAre you logging this from a phone on site, or from the full project page?`;
  }

  if (
    q.includes("profit") ||
    q.includes("margin") ||
    q.includes("finance") ||
    q.includes("budget")
  ) {
    if (user.role !== "owner") {
      return `Profit and margin are owner-only — that keeps site capture simple and protects sensitive numbers.\n\nYou can still record materials, labour, deliveries, and progress. Want a short path to Capture for your assigned sites?`;
    }
    return `Owners see contract value, budget, spend (materials + labour + delivery fees), remaining budget, running profit, and margin on the project Overview.\n\nCards on the dashboard also flag Healthy / Near limit / Over budget.\n\nAre you checking one project, or company-wide spend?`;
  }

  if (
    q.includes("progress") ||
    q.includes("photo") ||
    q.includes("video") ||
    q.includes("diary") ||
    q.includes("media")
  ) {
    return `The construction diary is under Progress on a project (or Capture → Progress).\nAdd a title, note, optional photos/videos, and you can link a delivery from that day.\n\nOwners also see “Latest from the sites” on the dashboard.\n\nDo you want help uploading media, or linking a delivery to an update?`;
  }

  if (
    q.includes("my sites") ||
    q.includes("sites dashboard") ||
    q.includes("staff dashboard") ||
    q.includes("clerk dashboard") ||
    (q.includes("foreman") && q.includes("home"))
  ) {
    if (user.role === "owner") {
      return `Clerks and foremen land on My sites (/workspace) — assigned projects, quick capture, and recent activity without profit numbers.\nOwners use Overview (/dashboard) for finance and company progress.\n\nWant to try a demo clerk login?`;
    }
    return `Your home is My sites in the sidebar (or /workspace after login).\nYou’ll see assigned sites, quick capture buttons, and recent activity — not owner budget or profit.\n\nOpen a site with Capture to log today’s work, or Open site for the full project tabs.`;
  }

  if (
    q.includes("material") ||
    q.includes("labour") ||
    q.includes("capture") ||
    q.includes("record")
  ) {
    return `Daily capture: open Capture (or My sites → Capture), pick a site, then Material / Labour / Delivery / Progress.\nFull tables (with edit/delete) are under each project section.\n\nWhat are you recording right now — materials, labour, or a delivery?`;
  }

  if (
    q.includes("export") ||
    q.includes("csv") ||
    q.includes("report")
  ) {
    if (user.role !== "owner") {
      return `Export is owner-only. Ask your organisation owner to open the project → Export and download the CSV.\n\nIs this for billing, or an internal site report?`;
    }
    return `Open a project → Export to download materials, labour, and delivery rows as CSV.\n\nNeed a report for one site, or guidance on what columns mean?`;
  }

  if (
    q.includes("profile") ||
    q.includes("password") ||
    q.includes("email") ||
    q.includes("account")
  ) {
    return `Profile is under Profile in the sidebar (or your name/avatar in the top bar).\nYou can update your name${user.role === "owner" ? " and organisation name" : ""}. Email is your login identity.\n\nWhat would you like to change?`;
  }

  return `I’m Jengaflow Assist — I can help with projects, invites, capture, progress media, and owner finance views.\n\nYou’re signed in as ${user.name} (${role}).\n\nTell me a bit more: are you trying to set something up, record site activity, or read a report?`;
}

type SupportAssistantProps = {
  user: SessionUser;
};

export function SupportAssistant({ user }: SupportAssistantProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      text: `Hi ${user.name.split(" ")[0]} — I’m Jengaflow Assist.\nI can help you navigate the workspace and answer how things work.\n\nWhat are you trying to do today?`,
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<number | null>(null);

  const openPanel = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMounted(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setVisible(true));
    });
  };

  const closePanel = () => {
    setVisible(false);
    closeTimer.current = window.setTimeout(() => {
      setMounted(false);
      closeTimer.current = null;
    }, ANIM_MS);
  };

  const togglePanel = () => {
    if (visible) closePanel();
    else openPanel();
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [mounted]);

  useEffect(() => {
    if (!visible) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, visible, pending]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || pending) return;

    const userMsg: ChatMessage = {
      id: createId(),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPending(true);

    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: createId(),
        role: "assistant",
        text: buildReply(trimmed, user),
      };
      setMessages((prev) => [...prev, reply]);
      setPending(false);
    }, 450 + Math.random() * 350);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      ask(input);
    }
  };

  return (
    <>
      {/* Soft backdrop — does not center anything */}
      {mounted ? (
        <button
          type="button"
          aria-label="Dismiss support"
          onClick={closePanel}
          className={`fixed inset-0 z-40 cursor-default bg-jf-ink/20 transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}

      {/* Bottom-right — panel opens above the icon with a smooth rise */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
        {mounted ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`flex h-[min(32rem,calc(100dvh-6.5rem))] w-[min(calc(100vw-2rem),22rem)] flex-col overflow-hidden border border-black/10 bg-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)] transition-all duration-[280ms] ease-out origin-bottom-right ${
              visible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-5 scale-[0.96] opacity-0"
            }`}
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 px-4 py-3">
              <div>
                <p className="landing-tracked text-[10px] font-semibold text-jf-red">
                  Support
                </p>
                <h2
                  id={titleId}
                  className="mt-0.5 text-sm font-semibold text-jf-ink"
                >
                  Jengaflow Assist
                </h2>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="landing-tracked cursor-pointer border border-black/15 px-2.5 py-1.5 text-[10px] font-semibold text-jf-ink hover:border-jf-ink"
              >
                Close
              </button>
            </header>

            <div
              ref={listRef}
              className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f4f4f2] px-4 py-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[92%] whitespace-pre-wrap px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-jf-ink text-white"
                        : "border border-black/10 bg-white text-jf-ink"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {pending ? (
                <div className="flex justify-start">
                  <div className="border border-black/10 bg-white px-3.5 py-2.5 text-sm text-jf-muted">
                    Thinking…
                  </div>
                </div>
              ) : null}
            </div>

            {messages.length <= 2 ? (
              <div className="shrink-0 border-t border-black/10 bg-white px-3 py-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <span className="landing-tracked shrink-0 text-[8px] font-semibold text-jf-muted">
                    Try
                  </span>
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      disabled={pending}
                      onClick={() => ask(suggestion)}
                      className="shrink-0 cursor-pointer border border-black/15 bg-[#f4f4f2] px-2 py-1 text-[10px] whitespace-nowrap text-jf-ink transition-colors hover:border-jf-ink disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <form
              onSubmit={onSubmit}
              className="flex shrink-0 items-end gap-2 border-t border-black/10 bg-white px-4 py-3"
            >
              <label className="sr-only" htmlFor="support-question">
                Your question
              </label>
              <input
                ref={inputRef}
                id="support-question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask a question…"
                disabled={pending}
                className="min-w-0 flex-1 border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="inline-flex cursor-pointer bg-black px-3 py-2.5 text-[10px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-50"
              >
                Ask
              </button>
            </form>
          </div>
        ) : null}

        <button
          type="button"
          onClick={togglePanel}
          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center bg-jf-red text-white shadow-[0_12px_40px_-18px_rgba(0,0,0,0.55)] transition-transform duration-200 hover:scale-[1.03]"
          aria-label={visible ? "Close support assistant" : "Open support assistant"}
          aria-expanded={visible}
        >
          {visible ? <CloseIcon /> : <SupportIcon />}
        </button>
      </div>
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3c-4.4 0-8 3.1-8 7 0 2.2 1.1 4.2 2.9 5.5L6 20l3.4-1.8c.8.2 1.7.3 2.6.3 4.4 0 8-3.1 8-7s-3.6-7-8-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 10.2h.01M12 10.2h.01M14.8 10.2h.01"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
