"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import type { MaterialEntry, SessionUser } from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import {
  addMaterial,
  deleteMaterial,
  getMaterials,
  materialTotalKes,
  updateMaterial,
} from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { formatDate, formatKes } from "@/lib/format";
import { EmptyState, Panel, SectionHeader } from "@/components/app/ui";

export default function MaterialsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [rows, setRows] = useState<MaterialEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    const load = async () => {
      if (!projectId) return;
      setRows(await getMaterials(projectId));
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
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      quantity: Number(form.get("quantity") ?? 0),
      unit: String(form.get("unit") ?? "").trim(),
      unitPriceKes: Number(form.get("unitPriceKes") ?? 0),
      supplier: String(form.get("supplier") ?? "").trim(),
      date: String(form.get("date") ?? ""),
    };
    if (editingId) {
      await updateMaterial(editingId, payload);
      setEditingId(null);
    } else {
      await addMaterial(user, projectId, payload);
      setOpen(false);
      event.currentTarget.reset();
    }
    setPending(false);
  };

  const total = rows.reduce((sum, row) => sum + materialTotalKes(row), 0);
  const formOpen = open || Boolean(editing);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Materials"
        title="Purchases and site materials"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setOpen((v) => !v);
            }}
            className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
          >
            {open && !editingId ? "Close" : "Add material"}
          </button>
        }
      />

      {formOpen ? (
        <Panel>
          <p className="mb-4 text-sm font-medium text-jf-ink">
            {editingId ? "Edit material" : "New material"}
          </p>
          <form
            key={editingId ?? "new"}
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => void onSubmit(e)}
          >
            <Input label="Material" name="name" required defaultValue={editing?.name} />
            <Input
              label="Supplier"
              name="supplier"
              required
              defaultValue={editing?.supplier}
            />
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              min={0}
              step="any"
              required
              defaultValue={editing?.quantity}
            />
            <Input
              label="Unit"
              name="unit"
              placeholder="bags, tonnes…"
              required
              defaultValue={editing?.unit}
            />
            <Input
              label="Unit price (KES)"
              name="unitPriceKes"
              type="number"
              min={0}
              required
              defaultValue={editing?.unitPriceKes}
            />
            <Input
              label="Date"
              name="date"
              type="date"
              required
              defaultValue={editing?.date}
            />
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex cursor-pointer border border-black bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
              >
                {pending ? "Saving…" : editingId ? "Update" : "Save material"}
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
        Total materials cost:{" "}
        <span className="font-semibold tabular-nums text-jf-ink">
          {formatKes(total)}
        </span>
      </p>

      {rows.length === 0 ? (
        <EmptyState
          title="No materials yet"
          body="Record purchases with quantity, unit price, and supplier. Totals feed the project finance view."
        />
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/10 text-[10px] tracking-[0.14em] text-jf-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Material</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
                <th className="px-4 py-3 font-semibold">Unit price</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Supplier</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium text-jf-ink">{row.name}</td>
                  <td className="px-4 py-3 tabular-nums text-jf-muted">
                    {row.quantity} {row.unit}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatKes(row.unitPriceKes)}
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums">
                    {formatKes(materialTotalKes(row))}
                  </td>
                  <td className="px-4 py-3 text-jf-muted">{row.supplier}</td>
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
                          window.confirm(`Remove ${row.name} from this project?`)
                        ) {
                          void deleteMaterial(row.id);
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

function Input({
  label,
  name,
  type = "text",
  required,
  min,
  step,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
  step?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
      />
    </label>
  );
}
