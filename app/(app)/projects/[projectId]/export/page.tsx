"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type {
  Delivery,
  LabourPayment,
  MaterialEntry,
  Project,
  SessionUser,
} from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import { canExportRecords } from "@/lib/auth/permissions";
import {
  getDeliveries,
  getLabour,
  getMaterials,
  getProject,
  materialTotalKes,
} from "@/lib/mock/projects";
import { formatKes } from "@/lib/format";
import { Panel, SectionHeader } from "@/components/app/ui";

export default function ExportPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [materials, setMaterials] = useState<MaterialEntry[]>([]);
  const [labour, setLabour] = useState<LabourPayment[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    if (!session || !projectId) return;
    void (async () => {
      setProject(await getProject(projectId, session.companyId));
      setMaterials(await getMaterials(projectId));
      setLabour(await getLabour(projectId));
      setDeliveries(await getDeliveries(projectId));
    })();
  }, [projectId]);

  if (!user || !project) {
    return (
      <p className="landing-tracked text-[11px] font-medium text-jf-muted">
        Loading
      </p>
    );
  }

  if (!canExportRecords(user.role)) {
    return (
      <Panel>
        <p className="text-sm text-jf-muted">
          Export is available to owners only.
        </p>
      </Panel>
    );
  }

  const downloadCsv = () => {
    const lines: string[] = [
      "section,date,description,amount_kes,meta",
      ...materials.map(
        (m) =>
          `material,${m.date},"${m.name.replace(/"/g, '""')}",${materialTotalKes(m)},"${m.supplier} · ${m.quantity} ${m.unit}"`,
      ),
      ...labour.map(
        (l) =>
          `labour,${l.date},"${l.workerName.replace(/"/g, '""')}",${l.amountKes},"${l.roleLabel} · ${l.paymentType}"`,
      ),
      ...deliveries.map(
        (d) =>
          `delivery,${d.date},"${d.itemDescription.replace(/"/g, '""')}",${d.deliveryFeeKes},"${d.vehicleLabel}"`,
      ),
    ];

    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}-records.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const materialsTotal = materials.reduce(
    (sum, m) => sum + materialTotalKes(m),
    0,
  );
  const labourTotal = labour.reduce((sum, l) => sum + l.amountKes, 0);
  const deliveryTotal = deliveries.reduce(
    (sum, d) => sum + d.deliveryFeeKes,
    0,
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Export"
        title="Project records"
      />

      <Panel>
        <p className="text-sm leading-relaxed text-jf-muted">
          Download a CSV of materials, labour, and deliveries for{" "}
          <span className="font-medium text-jf-ink">{project.name}</span>. PDF
          export will come with the reporting backend later.
        </p>

        <ul className="mt-6 space-y-2 text-sm">
          <li className="flex justify-between border-b border-black/8 py-2">
            <span>Materials lines</span>
            <span className="tabular-nums">
              {materials.length} · {formatKes(materialsTotal)}
            </span>
          </li>
          <li className="flex justify-between border-b border-black/8 py-2">
            <span>Labour payments</span>
            <span className="tabular-nums">
              {labour.length} · {formatKes(labourTotal)}
            </span>
          </li>
          <li className="flex justify-between border-b border-black/8 py-2">
            <span>Deliveries</span>
            <span className="tabular-nums">
              {deliveries.length} · {formatKes(deliveryTotal)}
            </span>
          </li>
        </ul>

        <button
          type="button"
          onClick={downloadCsv}
          className="mt-6 inline-flex cursor-pointer bg-black px-4 py-3 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
        >
          Download CSV
        </button>
      </Panel>
    </div>
  );
}
