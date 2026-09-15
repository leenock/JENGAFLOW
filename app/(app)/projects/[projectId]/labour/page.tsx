"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type {
  LabourPayment,
  LabourPaymentType,
  ProjectWorker,
  SessionUser,
} from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import {
  addLabour,
  deleteLabour,
  getLabour,
  getWorkers,
  updateLabour,
} from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { formatDate, formatKes } from "@/lib/format";
import { EmptyState, Panel, SectionHeader } from "@/components/app/ui";

const PAYMENT_TYPES: { value: LabourPaymentType; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "piecework", label: "Piecework" },
  { value: "salary", label: "Salary" },
];

function paymentTypeFromBasis(
  basis: ProjectWorker["payBasis"],
): LabourPaymentType {
  if (basis === "contract") return "piecework";
  return basis;
}

export default function LabourPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [rows, setRows] = useState<LabourPayment[]>([]);
  const [crew, setCrew] = useState<ProjectWorker[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [workerName, setWorkerName] = useState("");
  const [roleLabel, setRoleLabel] = useState("");
  const [amountKes, setAmountKes] = useState("");
  const [paymentType, setPaymentType] = useState<LabourPaymentType>("weekly");

  useEffect(() => {
    const session = readSession();
    setUser(session);
    const load = async () => {
      if (!projectId) return;
      setRows(await getLabour(projectId));
      setCrew(await getWorkers(projectId));
    };
    void load();
    return subscribeMockDb(() => {
      void load();
    });
  }, [projectId]);

  const editing = rows.find((r) => r.id === editingId) ?? null;
  const formOpen = open || Boolean(editing);
  const activeCrew = crew.filter((w) => w.status === "active");

  useEffect(() => {
    if (!formOpen) return;
    if (editing) {
      setSelectedWorkerId(editing.workerId ?? "");
      setWorkerName(editing.workerName);
      setRoleLabel(editing.roleLabel);
      setAmountKes(String(editing.amountKes));
      setPaymentType(editing.paymentType);
      return;
    }
    setSelectedWorkerId("");
    setWorkerName("");
    setRoleLabel("");
    setAmountKes("");
    setPaymentType("weekly");
  }, [formOpen, editingId, editing]);

  const onPickCrew = (workerId: string) => {
    setSelectedWorkerId(workerId);
    if (!workerId) return;
    const worker = crew.find((w) => w.id === workerId);
    if (!worker) return;
    setWorkerName(worker.name);
    setRoleLabel(worker.roleLabel);
    setAmountKes(String(worker.rateKes));
    setPaymentType(paymentTypeFromBasis(worker.payBasis));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setPending(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      workerName: workerName.trim(),
      roleLabel: roleLabel.trim(),
      amountKes: Number(amountKes),
      paymentType,
      date: String(form.get("date") ?? ""),
      workerId: selectedWorkerId || null,
    };
    if (editingId) {
      await updateLabour(editingId, payload);
      setEditingId(null);
    } else {
      await addLabour(user, projectId, payload);
      setOpen(false);
    }
    setPending(false);
  };

  const total = rows.reduce((sum, row) => sum + row.amountKes, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Labour"
        title="Labour payments"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setOpen((v) => !v);
            }}
            className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
          >
            {open && !editingId ? "Close" : "Add payment"}
          </button>
        }
      />

      <p className="text-sm text-jf-muted">
        Optionally pick someone from{" "}
        <Link
          href={`/projects/${projectId}/crew`}
          className="font-medium text-jf-ink no-underline hover:text-jf-red"
        >
          Crew
        </Link>{" "}
        to fill name, role, and rate.
      </p>

      {formOpen ? (
        <Panel>
          <p className="mb-4 text-sm font-medium text-jf-ink">
            {editingId ? "Edit payment" : "New payment"}
          </p>
          <form
            key={editingId ?? "new"}
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => void onSubmit(e)}
          >
            <label className="block sm:col-span-2">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                From crew (optional)
              </span>
              <select
                value={selectedWorkerId}
                onChange={(e) => onPickCrew(e.target.value)}
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              >
                <option value="">Manual entry / team name</option>
                {activeCrew.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} · {w.trade} · {w.roleLabel}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Worker / team
              </span>
              <input
                required
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              />
            </label>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Role
              </span>
              <input
                required
                value={roleLabel}
                onChange={(e) => setRoleLabel(e.target.value)}
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              />
            </label>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Amount (KES)
              </span>
              <input
                type="number"
                min={0}
                required
                value={amountKes}
                onChange={(e) => setAmountKes(e.target.value)}
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              />
            </label>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Payment type
              </span>
              <select
                value={paymentType}
                onChange={(e) =>
                  setPaymentType(e.target.value as LabourPaymentType)
                }
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              >
                {PAYMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Date
              </span>
              <input
                name="date"
                type="date"
                required
                defaultValue={editing?.date}
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              />
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
              >
                {pending ? "Saving…" : editingId ? "Update" : "Save payment"}
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

      <p className="text-sm text-jf-muted">
        Total labour:{" "}
        <span className="font-semibold tabular-nums text-jf-ink">
          {formatKes(total)}
        </span>
      </p>

      {rows.length === 0 ? (
        <EmptyState
          title="No labour payments yet"
          body="Record worker or team payments with role, amount, and payment type."
        />
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/10 text-[10px] tracking-[0.14em] text-jf-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Worker / team</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium">
                    {row.workerName}
                    {row.workerId ? (
                      <span className="mt-0.5 block text-[10px] text-jf-muted">
                        Linked to crew
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-jf-muted">{row.roleLabel}</td>
                  <td className="px-4 py-3 capitalize text-jf-muted">
                    {row.paymentType}
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums">
                    {formatKes(row.amountKes)}
                  </td>
                  <td className="px-4 py-3 text-jf-muted">
                    {formatDate(row.date)}
                  </td>
                  <td className="px-4 py-3 text-right">
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
                      className="ml-3 cursor-pointer text-[11px] font-semibold text-jf-muted hover:text-jf-red"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Remove payment for ${row.workerName}?`,
                          )
                        ) {
                          void deleteLabour(row.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
