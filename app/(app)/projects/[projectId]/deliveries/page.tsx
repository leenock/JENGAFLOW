"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import type { Delivery, SessionUser, Vehicle } from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import {
  addDelivery,
  deleteDelivery,
  getDeliveries,
  getVehicles,
  updateDelivery,
} from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { formatDate, formatKes } from "@/lib/format";
import { EmptyState, Panel, SectionHeader } from "@/components/app/ui";

export default function DeliveriesPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [rows, setRows] = useState<Delivery[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    const load = async () => {
      if (!projectId) return;
      setRows(await getDeliveries(projectId));
      setVehicles(await getVehicles(projectId));
    };
    void load();
    return subscribeMockDb(() => {
      void load();
    });
  }, [projectId]);

  const editing = rows.find((r) => r.id === editingId) ?? null;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setPending(true);
    const form = new FormData(event.currentTarget);
    const vehicleId = String(form.get("vehicleId") ?? "");
    const payload = {
      itemDescription: String(form.get("itemDescription") ?? "").trim(),
      quantity: Number(form.get("quantity") ?? 0),
      unit: String(form.get("unit") ?? "").trim(),
      deliveryFeeKes: Number(form.get("deliveryFeeKes") ?? 0),
      date: String(form.get("date") ?? ""),
      receivedBy: String(form.get("receivedBy") ?? "").trim(),
      vehicleId: vehicleId || null,
    };
    if (editingId) {
      await updateDelivery(editingId, payload);
      setEditingId(null);
    } else {
      await addDelivery(user, projectId, payload);
      setOpen(false);
      event.currentTarget.reset();
    }
    setPending(false);
  };

  const total = rows.reduce((sum, row) => sum + row.deliveryFeeKes, 0);
  const formOpen = open || Boolean(editing);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Deliveries"
        title="Site deliveries"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setOpen((v) => !v);
            }}
            className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
          >
            {open && !editingId ? "Close" : "Add delivery"}
          </button>
        }
      />

      {formOpen ? (
        <Panel>
          <p className="mb-4 text-sm font-medium text-jf-ink">
            {editingId ? "Edit delivery" : "New delivery"}
          </p>
          <form
            key={editingId ?? "new"}
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => void onSubmit(e)}
          >
            <Field
              label="Item / materials"
              name="itemDescription"
              required
              defaultValue={editing?.itemDescription}
            />
            <Field
              label="Received by"
              name="receivedBy"
              required
              defaultValue={editing?.receivedBy}
            />
            <Field
              label="Quantity"
              name="quantity"
              type="number"
              min={0}
              step="any"
              required
              defaultValue={editing?.quantity}
            />
            <Field
              label="Unit"
              name="unit"
              required
              defaultValue={editing?.unit}
            />
            <Field
              label="Delivery fee (KES)"
              name="deliveryFeeKes"
              type="number"
              min={0}
              required
              defaultValue={editing?.deliveryFeeKes}
            />
            <Field
              label="Date"
              name="date"
              type="date"
              required
              defaultValue={editing?.date}
            />
            <label className="block sm:col-span-2">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Vehicle
              </span>
              <select
                name="vehicleId"
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
                defaultValue={editing?.vehicleId ?? ""}
              >
                <option value="">No vehicle linked</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} — {v.label} ({v.kind})
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
              >
                {pending ? "Saving…" : editingId ? "Update" : "Save delivery"}
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
        Total delivery fees:{" "}
        <span className="font-semibold tabular-nums text-jf-ink">
          {formatKes(total)}
        </span>
      </p>

      {rows.length === 0 ? (
        <EmptyState
          title="No deliveries yet"
          body="Log what arrived, the fee, who received it, and which vehicle brought it."
        />
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-black/10 text-[10px] tracking-[0.14em] text-jf-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
                <th className="px-4 py-3 font-semibold">Fee</th>
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Received by</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium">
                    {row.itemDescription}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-jf-muted">
                    {row.quantity} {row.unit}
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums">
                    {formatKes(row.deliveryFeeKes)}
                  </td>
                  <td className="px-4 py-3 text-jf-muted">{row.vehicleLabel}</td>
                  <td className="px-4 py-3 text-jf-muted">{row.receivedBy}</td>
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
                            `Remove delivery “${row.itemDescription}”?`,
                          )
                        ) {
                          void deleteDelivery(row.id);
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

function Field({
  label,
  name,
  type = "text",
  required,
  min,
  step,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
  step?: string;
  defaultValue?: string | number;
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
        step={step}
        defaultValue={defaultValue}
        className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
      />
    </label>
  );
}
