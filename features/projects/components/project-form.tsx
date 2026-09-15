"use client";

import type { FormEvent } from "react";
import type { Project, ProjectInput, ProjectStatus } from "@/types/domain";

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On hold" },
  { value: "completed", label: "Completed" },
];

type ProjectFormProps = {
  initial?: Project | null;
  submitLabel: string;
  pending?: boolean;
  onSubmit: (input: ProjectInput) => void;
};

export function ProjectForm({
  initial,
  submitLabel,
  pending,
  onSubmit,
}: ProjectFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit({
      name: String(form.get("name") ?? "").trim(),
      location: String(form.get("location") ?? "").trim(),
      client: String(form.get("client") ?? "").trim(),
      status: String(form.get("status") ?? "planning") as ProjectStatus,
      contractValueKes: Number(form.get("contractValueKes") ?? 0),
      budgetKes: Number(form.get("budgetKes") ?? 0),
      startDate: String(form.get("startDate") ?? ""),
      progressPct: Number(form.get("progressPct") ?? initial?.progressPct ?? 0),
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Field label="Project name" name="name" defaultValue={initial?.name} required />
      <Field
        label="Location"
        name="location"
        defaultValue={initial?.location}
        required
      />
      <Field label="Client" name="client" defaultValue={initial?.client} required />
      <label className="block">
        <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
          Status
        </span>
        <select
          name="status"
          defaultValue={initial?.status ?? "planning"}
          className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Contract value (KES)"
          name="contractValueKes"
          type="number"
          min={0}
          defaultValue={initial?.contractValueKes ?? ""}
          required
        />
        <Field
          label="Planned budget (KES)"
          name="budgetKes"
          type="number"
          min={0}
          defaultValue={initial?.budgetKes ?? ""}
          required
        />
      </div>
      <Field
        label="Start date"
        name="startDate"
        type="date"
        defaultValue={initial?.startDate ?? ""}
        required
      />
      <Field
        label="Construction progress (%)"
        name="progressPct"
        type="number"
        min={0}
        defaultValue={initial?.progressPct ?? 0}
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex cursor-pointer bg-black px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="landing-tracked text-[11px] font-semibold text-jf-ink/50">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        defaultValue={defaultValue}
        className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-jf-red"
      />
    </label>
  );
}
