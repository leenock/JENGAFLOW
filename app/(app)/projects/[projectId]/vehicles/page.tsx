"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import type { SessionUser, Vehicle, VehicleKind } from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import { addVehicle, getVehicles } from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { formatDate } from "@/lib/format";
import { EmptyState, Panel, SectionHeader } from "@/components/app/ui";

export default function VehiclesPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [rows, setRows] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    const load = async () => {
      if (!projectId) return;
      setRows(await getVehicles(projectId));
    };
    void load();
    return subscribeMockDb(() => {
      void load();
    });
  }, [projectId]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setPending(true);
    const form = new FormData(event.currentTarget);
    await addVehicle(user, projectId, {
      plateNumber: String(form.get("plateNumber") ?? "").trim().toUpperCase(),
      label: String(form.get("label") ?? "").trim(),
      kind: String(form.get("kind") ?? "owned") as VehicleKind,
    });
    setPending(false);
    setOpen(false);
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Vehicles"
        title="Project vehicles"
        action={
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
          >
            {open ? "Close" : "Register vehicle"}
          </button>
        }
      />

      {open ? (
        <Panel>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => void onSubmit(e)}>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Plate number
              </span>
              <input
                name="plateNumber"
                required
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              />
            </label>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Label
              </span>
              <input
                name="label"
                required
                placeholder="Isuzu tipper"
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              />
            </label>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Ownership
              </span>
              <select
                name="kind"
                defaultValue="owned"
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              >
                <option value="owned">Company owned</option>
                <option value="hired">Hired</option>
              </select>
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save vehicle"}
              </button>
            </div>
          </form>
        </Panel>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          title="No vehicles registered"
          body="Register owned or hired vehicles so deliveries can be linked to the truck that brought materials."
        />
      ) : (
        <ul className="divide-y divide-black/8 border border-black/10 bg-white">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-5"
            >
              <div>
                <p className="font-semibold text-jf-ink">{row.plateNumber}</p>
                <p className="mt-1 text-sm text-jf-muted">{row.label}</p>
              </div>
              <div className="text-right">
                <span className="landing-tracked border border-black/15 px-2 py-1 text-[9px] font-semibold text-jf-muted">
                  {row.kind}
                </span>
                <p className="mt-2 text-[11px] text-jf-muted">
                  Added {formatDate(row.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
