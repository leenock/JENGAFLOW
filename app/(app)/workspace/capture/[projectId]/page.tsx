"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type {
  Delivery,
  LabourPaymentType,
  ProgressMedia,
  Project,
  SessionUser,
  Vehicle,
} from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import { canCaptureSiteData } from "@/lib/auth/permissions";
import {
  addDelivery,
  addLabour,
  addMaterial,
  addProgress,
  getDeliveries,
  getProject,
  getVehicles,
} from "@/lib/mock/projects";
import { MediaPicker } from "@/features/projects/components/media-picker";
import { Panel } from "@/components/app/ui";

type CaptureKind = "material" | "labour" | "delivery" | "progress";

const PAYMENT_TYPES: { value: LabourPaymentType; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "piecework", label: "Piecework" },
  { value: "salary", label: "Salary" },
];

function parseCaptureKind(raw: string | null): CaptureKind {
  if (
    raw === "material" ||
    raw === "labour" ||
    raw === "delivery" ||
    raw === "progress"
  ) {
    return raw;
  }
  return "material";
}

export default function CaptureProjectPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [mediaFiles, setMediaFiles] = useState<ProgressMedia[]>([]);
  const [kind, setKind] = useState<CaptureKind>("material");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setKind(
      parseCaptureKind(new URLSearchParams(window.location.search).get("kind")),
    );
  }, [projectId]);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    if (!session || !projectId) return;
    void getProject(projectId, session.companyId).then(setProject);
    void getVehicles(projectId).then(setVehicles);
    void getDeliveries(projectId).then(setDeliveries);
  }, [projectId]);

  if (!user || !project) {
    return (
      <p className="landing-tracked text-[11px] font-medium text-jf-muted">
        Loading capture
      </p>
    );
  }

  if (!canCaptureSiteData(user.role)) {
    return <p className="text-sm text-jf-muted">Capture is not available.</p>;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const today = new Date().toISOString().slice(0, 10);

    try {
      if (kind === "material") {
        await addMaterial(user, projectId, {
          name: String(form.get("name") ?? "").trim(),
          quantity: Number(form.get("quantity") ?? 0),
          unit: String(form.get("unit") ?? "").trim(),
          unitPriceKes: Number(form.get("unitPriceKes") ?? 0),
          supplier: String(form.get("supplier") ?? "").trim(),
          date: String(form.get("date") ?? today),
        });
        setMessage("Material saved. Add another or switch tab.");
      } else if (kind === "labour") {
        await addLabour(user, projectId, {
          workerName: String(form.get("workerName") ?? "").trim(),
          roleLabel: String(form.get("roleLabel") ?? "").trim(),
          amountKes: Number(form.get("amountKes") ?? 0),
          paymentType: String(
            form.get("paymentType") ?? "daily",
          ) as LabourPaymentType,
          date: String(form.get("date") ?? today),
        });
        setMessage("Labour payment saved.");
      } else if (kind === "delivery") {
        const vehicleId = String(form.get("vehicleId") ?? "");
        await addDelivery(user, projectId, {
          itemDescription: String(form.get("itemDescription") ?? "").trim(),
          quantity: Number(form.get("quantity") ?? 0),
          unit: String(form.get("unit") ?? "").trim(),
          deliveryFeeKes: Number(form.get("deliveryFeeKes") ?? 0),
          date: String(form.get("date") ?? today),
          receivedBy: user.name,
          vehicleId: vehicleId || null,
        });
        void getDeliveries(projectId).then(setDeliveries);
        setMessage("Delivery saved.");
      } else {
        const linked = String(form.get("linkedDeliveryId") ?? "");
        await addProgress(user, projectId, {
          title: String(form.get("title") ?? "").trim(),
          description: String(form.get("description") ?? "").trim(),
          mediaFiles,
          linkedDeliveryId: linked || null,
        });
        setMediaFiles([]);
        setMessage("Progress update saved.");
      }
      setFormKey((k) => k + 1);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link
          href="/workspace"
          className="landing-tracked text-[10px] font-semibold text-jf-muted no-underline hover:text-jf-ink"
        >
          ← My sites
        </Link>
        <h1 className="mt-3 text-xl font-semibold text-jf-ink md:text-2xl">
          {project.name}
        </h1>
        <p className="mt-1 text-sm text-jf-muted">{project.location}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            ["material", "Material"],
            ["labour", "Labour"],
            ["delivery", "Delivery"],
            ["progress", "Progress"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setKind(value);
              setMessage(null);
            }}
            className={`min-h-12 cursor-pointer px-2 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase ${
              kind === value
                ? "bg-jf-ink text-white"
                : "border border-black/15 bg-white text-jf-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Panel>
        {message ? (
          <div className="mb-4 border border-black/10 bg-[#f4f4f2] px-3 py-3 text-sm font-medium text-jf-ink">
            {message}
          </div>
        ) : null}
        <form
          key={`${kind}-${formKey}`}
          className="space-y-5"
          onSubmit={(e) => void onSubmit(e)}
        >
          {kind === "material" ? (
            <>
              <CaptureField label="Material" name="name" required />
              <CaptureField label="Supplier" name="supplier" required />
              <div className="grid grid-cols-2 gap-3">
                <CaptureField
                  label="Qty"
                  name="quantity"
                  type="number"
                  required
                />
                <CaptureField label="Unit" name="unit" required />
              </div>
              <CaptureField
                label="Unit price"
                name="unitPriceKes"
                type="number"
                required
              />
              <CaptureField label="Date" name="date" type="date" required />
            </>
          ) : null}

          {kind === "labour" ? (
            <>
              <CaptureField
                label="Worker / team"
                name="workerName"
                required
              />
              <CaptureField label="Role" name="roleLabel" required />
              <CaptureField
                label="Amount"
                name="amountKes"
                type="number"
                required
              />
              <label className="block">
                <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                  Payment type
                </span>
                <select
                  name="paymentType"
                  defaultValue="daily"
                  className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-base outline-none sm:text-sm"
                >
                  {PAYMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <CaptureField label="Date" name="date" type="date" required />
            </>
          ) : null}

          {kind === "delivery" ? (
            <>
              <CaptureField
                label="What arrived"
                name="itemDescription"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <CaptureField
                  label="Qty"
                  name="quantity"
                  type="number"
                  required
                />
                <CaptureField label="Unit" name="unit" required />
              </div>
              <CaptureField
                label="Delivery fee"
                name="deliveryFeeKes"
                type="number"
                required
              />
              <label className="block">
                <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                  Vehicle
                </span>
                <select
                  name="vehicleId"
                  className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-base outline-none sm:text-sm"
                  defaultValue=""
                >
                  <option value="">None</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber}
                    </option>
                  ))}
                </select>
              </label>
              <CaptureField label="Date" name="date" type="date" required />
            </>
          ) : null}

          {kind === "progress" ? (
            <>
              <CaptureField label="Title" name="title" required />
              <label className="block">
                <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                  Note
                </span>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="mt-2 w-full border border-black/15 p-3 text-base outline-none sm:text-sm"
                />
              </label>
              <MediaPicker value={mediaFiles} onChange={setMediaFiles} />
              <label className="block">
                <span className="landing-tracked text-[10px] font-semibold text-jf-ink/50">
                  Link delivery (optional)
                </span>
                <select
                  name="linkedDeliveryId"
                  className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-base outline-none sm:text-sm"
                  defaultValue=""
                >
                  <option value="">None</option>
                  {deliveries.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.date} · {d.itemDescription}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="min-h-12 w-full cursor-pointer bg-jf-red py-3.5 text-[11px] font-semibold tracking-[0.16em] text-white uppercase disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save record"}
          </button>
        </form>
      </Panel>

      <Link
        href={`/projects/${projectId}`}
        className="landing-tracked block text-center text-[10px] font-semibold text-jf-muted no-underline hover:text-jf-ink"
      >
        Open full project view
      </Link>
    </div>
  );
}

function CaptureField({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: number;
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
        defaultValue={defaultValue}
        className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-base outline-none focus:border-jf-red sm:text-sm"
      />
    </label>
  );
}
