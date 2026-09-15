"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { SessionUser } from "@/types/domain";
import { roleLabel } from "@/lib/auth/permissions";
import { readSession, updateProfile } from "@/lib/auth/session";
import { Panel, SectionHeader } from "@/components/app/ui";

export default function ProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const session = readSession();
      setUser(session);
      if (session) {
        setName(session.name);
        setEmail(session.email);
        setCompanyName(session.companyName);
      }
    };
    sync();
    window.addEventListener("jengaflow:session", sync);
    return () => window.removeEventListener("jengaflow:session", sync);
  }, []);

  if (!user) {
    return (
      <p className="landing-tracked text-[11px] font-medium text-jf-muted">
        Loading profile
      </p>
    );
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSaved(false);
    const next = updateProfile({
      name,
      email,
      companyName: user.role === "owner" ? companyName : undefined,
    });
    setPending(false);
    if (!next) {
      setError(
        "Could not save. Check the fields — email may already be in use.",
      );
      return;
    }
    setUser(next);
    setName(next.name);
    setEmail(next.email);
    setCompanyName(next.companyName);
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <SectionHeader eyebrow="Account" title="Your profile" />

      <div className="flex items-center gap-4 border border-black/10 bg-white px-5 py-5">
        <div
          className="grid h-14 w-14 place-items-center border border-black/15 bg-[#f4f4f2] text-sm font-semibold tracking-wide text-jf-ink"
          aria-hidden
        >
          {initials}
        </div>
        <div>
          <p className="font-semibold text-jf-ink">{user.name}</p>
          <p className="mt-1 text-sm text-jf-muted">
            {roleLabel(user.role)} · {user.companyName}
          </p>
        </div>
      </div>

      <Panel>
        <form className="space-y-5" onSubmit={onSubmit}>
          <label className="block">
            <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
              Full name
            </span>
            <input
              name="name"
              required
              value={name}
              onChange={(e) => {
                setSaved(false);
                setName(e.target.value);
              }}
              className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
            />
          </label>

          <label className="block">
            <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setSaved(false);
                setEmail(e.target.value);
              }}
              className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
            />
          </label>

          {user.role === "owner" ? (
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Organisation name
              </span>
              <input
                name="companyName"
                required
                value={companyName}
                onChange={(e) => {
                  setSaved(false);
                  setCompanyName(e.target.value);
                }}
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              />
            </label>
          ) : (
            <div>
              <p className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Organisation
              </p>
              <p className="mt-2 border-b border-black/10 py-2.5 text-sm text-jf-ink">
                {user.companyName}
              </p>
            </div>
          )}

          <div>
            <p className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
              Role
            </p>
            <p className="mt-2 border-b border-black/10 py-2.5 text-sm text-jf-ink">
              {roleLabel(user.role)}
            </p>
            <p className="mt-2 text-xs text-jf-muted">
              Role is set by the organisation owner and cannot be changed here.
            </p>
          </div>

          <label className="block">
            <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
              Password
            </span>
            <input
              type="password"
              disabled
              placeholder="Managed when real auth lands"
              className="mt-2 w-full border-0 border-b border-black/15 bg-transparent py-2.5 text-sm text-jf-muted outline-none disabled:cursor-not-allowed"
            />
          </label>

          {error ? (
            <p className="text-sm text-jf-red" role="alert">
              {error}
            </p>
          ) : null}
          {saved ? (
            <p className="text-sm text-jf-ink" role="status">
              Profile saved.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </form>
      </Panel>
    </div>
  );
}
