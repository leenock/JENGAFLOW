"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import type {
  CompanyPerson,
  Project,
  SessionUser,
  UserRole,
} from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import { canManageTeam, roleLabel } from "@/lib/auth/permissions";
import {
  assignPersonToProject,
  getCompanyPeople,
  getProjects,
  inviteCompanyPerson,
} from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { formatDate } from "@/lib/format";
import { EmptyState, Panel, SectionHeader } from "@/components/app/ui";

export default function PeoplePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [people, setPeople] = useState<CompanyPerson[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [assignPending, setAssignPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    if (!session) return;

    const load = async () => {
      const [peopleRows, projectRows] = await Promise.all([
        getCompanyPeople(session.companyId),
        getProjects(session.companyId),
      ]);
      setPeople(peopleRows);
      setProjects(projectRows);
    };

    void load();
    return subscribeMockDb(() => {
      void load();
    });
  }, []);

  if (!user) {
    return (
      <p className="landing-tracked text-[11px] font-medium text-jf-muted">
        Loading
      </p>
    );
  }

  if (!canManageTeam(user.role)) {
    return (
      <EmptyState
        title="People is owner-only"
        body="Clerks and foremen see only the sites they are assigned to."
      />
    );
  }

  const projectName = (id: string) =>
    projects.find((p) => p.id === id)?.name ?? id;

  const onInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const selected = form.getAll("projectIds").map(String);
    if (selected.length === 0) {
      setError("Choose at least one project.");
      setPending(false);
      return;
    }
    await inviteCompanyPerson(user, {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      role: String(form.get("role") ?? "clerk") as Exclude<UserRole, "owner">,
      projectIds: selected,
    });
    setPending(false);
    setOpen(false);
    event.currentTarget.reset();
  };

  const onAssign = async (personId: string, projectId: string) => {
    if (!projectId) return;
    setAssignPending(personId);
    await assignPersonToProject(user, personId, projectId);
    setAssignPending(null);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Organisation"
        title="People"
        action={
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
          >
            {open ? "Close" : "Invite person"}
          </button>
        }
      />

      <p className="max-w-2xl text-sm text-jf-muted">
        Invite clerks and foremen once, assign them to projects, then they sign
        in with that email (demo — any password). Site capture stays scoped to
        their projects; profit stays with you.
      </p>

      {open ? (
        <Panel>
          {error ? (
            <p className="mb-3 text-sm text-jf-red" role="alert">
              {error}
            </p>
          ) : null}
          <form className="space-y-4" onSubmit={(e) => void onInvite(e)}>
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
            <fieldset>
              <legend className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Assign to projects
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {projects.map((project) => (
                  <label
                    key={project.id}
                    className="flex items-center gap-2 text-sm text-jf-ink"
                  >
                    <input
                      type="checkbox"
                      name="projectIds"
                      value={project.id}
                      className="accent-jf-red"
                    />
                    {project.name}
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send invite"}
            </button>
          </form>
        </Panel>
      ) : null}

      {people.length === 0 ? (
        <EmptyState
          title="No people yet"
          body="Invite clerks or foremen and assign them to sites so they can capture daily activity."
        />
      ) : (
        <ul className="divide-y divide-black/8 border border-black/10 bg-white">
          {people.map((person) => {
            const unassigned = projects.filter(
              (p) => !person.projectIds.includes(p.id),
            );
            return (
              <li key={person.id} className="px-4 py-5 md:px-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-jf-ink">{person.name}</p>
                    <p className="mt-1 text-sm text-jf-muted">{person.email}</p>
                    <p className="mt-2 landing-tracked text-[9px] text-jf-muted">
                      {roleLabel(person.role)} · {person.status} · invited{" "}
                      {formatDate(person.invitedAt)}
                    </p>
                  </div>
                  {unassigned.length > 0 ? (
                    <form
                      className="flex flex-wrap items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = new FormData(e.currentTarget);
                        void onAssign(
                          person.id,
                          String(form.get("projectId") ?? ""),
                        );
                      }}
                    >
                      <select
                        name="projectId"
                        required
                        defaultValue=""
                        className="border-0 border-b border-black/20 bg-transparent py-1.5 text-sm outline-none"
                      >
                        <option value="" disabled>
                          Add to project…
                        </option>
                        {unassigned.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={assignPending === person.id}
                        className="cursor-pointer border border-black/15 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase disabled:opacity-60"
                      >
                        {assignPending === person.id ? "…" : "Assign"}
                      </button>
                    </form>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {person.projectIds.length === 0 ? (
                    <span className="text-xs text-jf-muted">
                      No projects assigned
                    </span>
                  ) : (
                    person.projectIds.map((id) => (
                      <Link
                        key={id}
                        href={`/projects/${id}/team`}
                        className="border border-black/10 bg-[#f4f4f2] px-2.5 py-1 text-[11px] text-jf-ink no-underline hover:border-jf-ink"
                      >
                        {projectName(id)}
                      </Link>
                    ))
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
