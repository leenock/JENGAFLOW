"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type {
  ProjectWorker,
  SessionUser,
  WorkerPayBasis,
  WorkerStatus,
} from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import {
  addWorker,
  deleteWorker,
  getWorkers,
  updateWorker,
} from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { formatDate, formatKes } from "@/lib/format";
import { EmptyState, Panel, SectionHeader } from "@/components/app/ui";

const PAY_BASIS: { value: WorkerPayBasis; label: string }[] = [
  { value: "daily", label: "Daily rate" },
  { value: "weekly", label: "Weekly rate" },
  { value: "contract", label: "Contract" },
];

const STATUSES: { value: WorkerStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
];

const TRADE_HINTS = [
  "Plumbing",
  "Masonry",
  "Electrical",
  "Carpentry",
  "Steel fixing",
  "Roofing",
  "Painting",
  "General labour",
];

function payLabel(basis: WorkerPayBasis, rate: number) {
  const amount = formatKes(rate);
  if (basis === "daily") return `${amount} / day`;
  if (basis === "weekly") return `${amount} / week`;
  return `${amount} contract`;
}

function statusTone(status: WorkerStatus) {
  if (status === "active") return "border-black/15 text-jf-ink";
  if (status === "paused") return "border-jf-red/30 text-jf-red";
  return "border-black/10 text-jf-muted";
}

export default function CrewPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [rows, setRows] = useState<ProjectWorker[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    const load = async () => {
      if (!projectId) return;
      setRows(await getWorkers(projectId));
    };
    void load();
    return subscribeMockDb(() => {
      void load();
    });
  }, [projectId]);

  const editing = rows.find((r) => r.id === editingId) ?? null;
  const formOpen = open || Boolean(editing);
  const activeCount = rows.filter((r) => r.status === "active").length;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setPending(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      trade: String(form.get("trade") ?? "").trim(),
      roleLabel: String(form.get("roleLabel") ?? "").trim(),
      payBasis: String(form.get("payBasis") ?? "daily") as WorkerPayBasis,
      rateKes: Number(form.get("rateKes") ?? 0),
      phone: String(form.get("phone") ?? "").trim() || null,
      status: String(form.get("status") ?? "active") as WorkerStatus,
      startDate: String(form.get("startDate") ?? ""),
      notes: String(form.get("notes") ?? "").trim() || null,
    };
    if (editingId) {
      await updateWorker(editingId, payload);
      setEditingId(null);
    } else {
      await addWorker(user, projectId, payload);
      setOpen(false);
      event.currentTarget.reset();
    }
    setPending(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Crew"
        title="Site workforce on this project"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setOpen((v) => !v);
            }}
            className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
          >
            {open && !editingId ? "Close" : "Add worker"}
          </button>
        }
      />

      <p className="max-w-2xl text-sm text-jf-muted">
        Plumbers, masons, electricians and other site workers — separate from
        Team (clerks/foremen with app login). Record trade, role, and daily or
        contract pay.{" "}
        <Link
          href={`/projects/${projectId}/labour`}
          className="font-medium text-jf-ink no-underline hover:text-jf-red"
        >
          Log a labour payment →
        </Link>
      </p>

      <p className="text-sm text-jf-muted">
        {activeCount} active · {rows.length} total on this site
      </p>

      {formOpen ? (
        <Panel>
          <p className="mb-4 text-sm font-medium text-jf-ink">
            {editingId ? "Edit worker" : "New worker"}
          </p>
          <form
            key={editingId ?? "new"}
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => void onSubmit(e)}
          >
            <Field
              label="Full name"
              name="name"
              required
              defaultValue={editing?.name}
            />
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Trade
              </span>
              <input
                name="trade"
                required
                list="crew-trades"
                defaultValue={editing?.trade}
                placeholder="Plumbing, Masonry…"
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              />
              <datalist id="crew-trades">
                {TRADE_HINTS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </label>
            <Field
              label="Role"
              name="roleLabel"
              required
              defaultValue={editing?.roleLabel}
              placeholder="Lead plumber, Helper…"
            />
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Pay basis
              </span>
              <select
                name="payBasis"
                defaultValue={editing?.payBasis ?? "daily"}
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              >
                {PAY_BASIS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Rate / contract (KES)"
              name="rateKes"
              type="number"
              min={0}
              required
              defaultValue={editing?.rateKes}
            />
            <Field
              label="Phone"
              name="phone"
              defaultValue={editing?.phone ?? ""}
            />
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Status
              </span>
              <select
                name="status"
                defaultValue={editing?.status ?? "active"}
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              >
                {STATUSES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Start date"
              name="startDate"
              type="date"
              required
              defaultValue={editing?.startDate}
            />
            <label className="block sm:col-span-2">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Notes
              </span>
              <textarea
                name="notes"
                rows={2}
                defaultValue={editing?.notes ?? ""}
                className="mt-2 w-full border border-black/15 bg-transparent p-3 text-sm outline-none focus:border-jf-red"
              />
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
              >
                {pending ? "Saving…" : editingId ? "Update" : "Save worker"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="inline-flex cursor-pointer border border-black/15 px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </Panel>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          title="No crew on this project yet"
          body="Add plumbers, masons, and other site workers with their trade and pay basis."
        />
      ) : (
        <ul className="divide-y divide-black/8 border border-black/10 bg-white">
          {rows.map((row) => (
            <li key={row.id} className="px-4 py-4 md:px-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-jf-ink">{row.name}</p>
                    <span
                      className={`landing-tracked border px-2 py-0.5 text-[8px] font-semibold ${statusTone(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-jf-muted">
                    {row.trade} · {row.roleLabel}
                  </p>
                  <p className="mt-2 text-sm font-medium tabular-nums text-jf-ink">
                    {payLabel(row.payBasis, row.rateKes)}
                  </p>
                  <p className="mt-2 text-[11px] text-jf-muted">
                    Started {formatDate(row.startDate)}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  {row.notes ? (
                    <p className="mt-2 max-w-xl text-sm text-jf-muted">
                      {row.notes}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="cursor-pointer text-[11px] font-semibold text-jf-ink hover:text-jf-red"
                    onClick={() => {
                      setOpen(false);
                      setEditingId(row.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer text-[11px] font-semibold text-jf-muted hover:text-jf-red"
                    onClick={() => {
                      if (window.confirm(`Remove ${row.name} from this crew?`)) {
                        void deleteWorker(row.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  min,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
  defaultValue?: string | number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
      />
    </label>
  );
}
