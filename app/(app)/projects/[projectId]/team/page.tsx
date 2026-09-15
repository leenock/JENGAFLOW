"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import type { ProjectMember, SessionUser, UserRole } from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import { canManageTeam, roleLabel } from "@/lib/auth/permissions";
import { getMembers, inviteMember } from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { formatDate } from "@/lib/format";
import { EmptyState, Panel, SectionHeader } from "@/components/app/ui";

export default function TeamPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [rows, setRows] = useState<ProjectMember[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    const load = async () => {
      if (!projectId) return;
      setRows(await getMembers(projectId));
    };
    void load();
    return subscribeMockDb(() => {
      void load();
    });
  }, [projectId]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (!canManageTeam(user.role)) {
      setError("Only owners can invite team members.");
      return;
    }
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    await inviteMember(user, projectId, {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      role: String(form.get("role") ?? "clerk") as Exclude<UserRole, "owner">,
    });
    setPending(false);
    setOpen(false);
    event.currentTarget.reset();
  };

  const canInvite = user ? canManageTeam(user.role) : false;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Team"
        title="Clerks and foremen on this project"
        action={
          canInvite ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
            >
              {open ? "Close" : "Invite member"}
            </button>
          ) : null
        }
      />

      <p className="text-sm text-jf-muted">
        App logins for capture. For plumbers, masons and other site workers, use{" "}
        <a
          href={`/projects/${projectId}/crew`}
          className="font-medium text-jf-ink no-underline hover:text-jf-red"
        >
          Site crew
        </a>
        .
      </p>

      {open ? (
        <Panel>
          {error ? (
            <p className="mb-3 text-sm text-jf-red" role="alert">
              {error}
            </p>
          ) : null}
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => void onSubmit(e)}>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Full name
              </span>
              <input
                name="name"
                required
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
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              />
            </label>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Role
              </span>
              <select
                name="role"
                defaultValue="clerk"
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              >
                <option value="clerk">Clerk</option>
                <option value="foreman">Foreman</option>
              </select>
            </label>
            <div className="sm:col-span-2">
              <p className="mb-3 text-xs text-jf-muted">
                They appear under People and can sign in with this email (demo —
                any password). Capture stays limited to assigned projects.
              </p>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
              >
                {pending ? "Sending…" : "Send invite"}
              </button>
            </div>
          </form>
        </Panel>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          title="No team members yet"
          body="Invite clerks or foremen so they can capture materials, labour, deliveries, and progress on this site."
        />
      ) : (
        <ul className="divide-y divide-black/8 border border-black/10 bg-white">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-5"
            >
              <div>
                <p className="font-semibold text-jf-ink">{row.name}</p>
                <p className="mt-1 text-sm text-jf-muted">{row.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-jf-ink">
                  {roleLabel(row.role)}
                </p>
                <p className="mt-1 landing-tracked text-[9px] text-jf-muted">
                  {row.status} · {formatDate(row.invitedAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
