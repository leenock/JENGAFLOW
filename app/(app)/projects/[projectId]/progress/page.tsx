"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import type {
  Delivery,
  ProgressMedia,
  ProgressUpdate,
  SessionUser,
} from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import {
  addProgress,
  getDeliveries,
  getProjectProgress,
} from "@/lib/mock/projects";
import { subscribeMockDb } from "@/lib/mock/store";
import { EmptyState, Panel, SectionHeader } from "@/components/app/ui";
import { MediaPicker } from "@/features/projects/components/media-picker";
import { ProgressTimeline } from "@/features/projects/components/progress-timeline";

export default function ProgressPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [rows, setRows] = useState<ProgressUpdate[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [mediaFiles, setMediaFiles] = useState<ProgressMedia[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    const load = async () => {
      if (!projectId) return;
      const [progress, deliveryRows] = await Promise.all([
        getProjectProgress(projectId, 50),
        getDeliveries(projectId),
      ]);
      setRows(progress);
      setDeliveries(deliveryRows);
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
    const linked = String(form.get("linkedDeliveryId") ?? "");
    await addProgress(user, projectId, {
      title: String(form.get("title") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      mediaFiles,
      linkedDeliveryId: linked || null,
    });
    setPending(false);
    setOpen(false);
    setMediaFiles([]);
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Progress"
        title="Construction diary"
        action={
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
          >
            {open ? "Close" : "Add update"}
          </button>
        }
      />

      {open ? (
        <Panel>
          <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Title
              </span>
              <input
                name="title"
                required
                placeholder="Foundation completed — Block A"
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              />
            </label>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Description
              </span>
              <textarea
                name="description"
                required
                rows={3}
                className="mt-2 w-full border border-black/15 bg-transparent p-3 text-sm outline-none focus:border-jf-red"
              />
            </label>
            <div>
              <p className="landing-tracked mb-2 text-[10px] font-semibold text-jf-ink/50">
                Media
              </p>
              <MediaPicker value={mediaFiles} onChange={setMediaFiles} />
            </div>
            <label className="block">
              <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                Link to delivery (optional)
              </span>
              <select
                name="linkedDeliveryId"
                defaultValue=""
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-2.5 text-sm outline-none focus:border-jf-red"
              >
                <option value="">None</option>
                {deliveries.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.date} · {d.itemDescription}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex cursor-pointer bg-black px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save update"}
            </button>
          </form>
        </Panel>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          title="No progress updates"
          body="Add stage notes and photos so owners can see how the building is moving."
        />
      ) : (
        <ProgressTimeline items={rows} />
      )}
    </div>
  );
}
