"use client";

import type {
  CompanyPerson,
  CostLine,
  Delivery,
  LabourPayment,
  MaterialEntry,
  ProgressMedia,
  ProgressUpdate,
  Project,
  ProjectActivity,
  ProjectCostBreakdown,
  ProjectFinanceSummary,
  ProjectInput,
  ProjectMember,
  ProjectPulse,
  ProjectWorker,
  SessionUser,
  SpendPace,
  UserRole,
  Vehicle,
  WorkerPayBasis,
  WorkerStatus,
} from "@/types/domain";
import { createId } from "./ids";
import { readMockDb, updateMockDb } from "./store";
import { budgetUsedPct } from "@/lib/format";

function nowIso() {
  return new Date().toISOString();
}

function normalizeProject(project: Project): Project {
  return {
    ...project,
    progressPct:
      typeof project.progressPct === "number"
        ? Math.min(100, Math.max(0, project.progressPct))
        : 0,
  };
}

function dateKey(isoOrDate: string): string {
  return isoOrDate.slice(0, 10);
}

function monthKey(isoOrDate: string): string {
  return isoOrDate.slice(0, 7);
}

function aggregateLines(
  rows: Array<{ key: string; label: string; amountKes: number }>,
): CostLine[] {
  const map = new Map<string, CostLine>();
  for (const row of rows) {
    const existing = map.get(row.key);
    if (existing) {
      existing.amountKes += row.amountKes;
      existing.count += 1;
    } else {
      map.set(row.key, {
        key: row.key,
        label: row.label,
        amountKes: row.amountKes,
        count: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.amountKes - a.amountKes);
}

function spendPace(
  budgetUsed: number,
  progressPct: number,
): { pace: SpendPace; message: string | null } {
  if (progressPct <= 0 && budgetUsed <= 0) {
    return { pace: "unknown", message: null };
  }
  if (progressPct <= 0 && budgetUsed > 5) {
    return {
      pace: "ahead",
      message:
        "Spending has started but construction progress % has not been set.",
    };
  }
  const gap = budgetUsed - progressPct;
  if (gap >= 12) {
    return {
      pace: "ahead",
      message: `Spending is ahead of progress — budget used ${budgetUsed.toFixed(0)}% vs construction ~${progressPct.toFixed(0)}%.`,
    };
  }
  if (gap <= -12) {
    return {
      pace: "behind",
      message: `Progress looks ahead of spend — construction ~${progressPct.toFixed(0)}% vs budget used ${budgetUsed.toFixed(0)}%. Check under-reporting.`,
    };
  }
  return {
    pace: "aligned",
    message: "Spend and reported progress are roughly aligned.",
  };
}

function touchProject(projectId: string) {
  updateMockDb((db) => ({
    ...db,
    projects: db.projects.map((p) =>
      p.id === projectId ? { ...p, updatedAt: nowIso() } : p,
    ),
  }));
}

function pushActivity(
  partial: Omit<ProjectActivity, "id" | "createdAt"> & { createdAt?: string },
) {
  updateMockDb((db) => ({
    ...db,
    activities: [
      {
        id: createId("act"),
        createdAt: partial.createdAt ?? nowIso(),
        ...partial,
      },
      ...db.activities,
    ],
  }));
}

export function materialTotalKes(entry: MaterialEntry): number {
  return Math.round(entry.quantity * entry.unitPriceKes);
}

export async function getProjects(companyId: string): Promise<Project[]> {
  return readMockDb()
    .projects.filter((p) => p.companyId === companyId)
    .map(normalizeProject)
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

/** Owners see all company projects; site staff see only assigned projects. */
export async function getProjectsForSession(
  user: SessionUser,
): Promise<Project[]> {
  const all = await getProjects(user.companyId);
  if (user.role === "owner") return all;

  const person = readMockDb().people.find(
    (p) => p.email.toLowerCase() === user.email.toLowerCase(),
  );
  const fromPeople = new Set(person?.projectIds ?? []);
  const fromMembers = readMockDb()
    .members.filter((m) => m.email.toLowerCase() === user.email.toLowerCase())
    .map((m) => m.projectId);
  for (const id of fromMembers) fromPeople.add(id);

  return all.filter((p) => fromPeople.has(p.id));
}

/** Recent site activity across projects the signed-in user can access. */
export async function getRecentActivitiesForSession(
  user: SessionUser,
  limit = 10,
): Promise<Array<ProjectActivity & { projectName: string }>> {
  const projects = await getProjectsForSession(user);
  const projectIds = new Set(projects.map((p) => p.id));
  const nameById = Object.fromEntries(
    projects.map((p) => [p.id, p.name] as const),
  );

  return readMockDb()
    .activities.filter((a) => projectIds.has(a.projectId))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit)
    .map((row) => ({
      ...row,
      projectName: nameById[row.projectId] ?? "Project",
    }));
}

export async function getProject(
  projectId: string,
  companyId: string,
): Promise<Project | null> {
  const row = readMockDb().projects.find(
    (p) => p.id === projectId && p.companyId === companyId,
  );
  return row ? normalizeProject(row) : null;
}

export async function createProject(
  companyId: string,
  input: ProjectInput,
): Promise<Project> {
  const project: Project = {
    id: createId("prj"),
    companyId,
    name: input.name,
    location: input.location,
    client: input.client,
    status: input.status,
    contractValueKes: input.contractValueKes,
    budgetKes: input.budgetKes,
    startDate: input.startDate,
    progressPct: input.progressPct ?? 0,
    updatedAt: nowIso(),
  };

  updateMockDb((db) => ({
    ...db,
    projects: [project, ...db.projects],
  }));

  return project;
}

export async function updateProject(
  projectId: string,
  companyId: string,
  input: ProjectInput,
): Promise<Project | null> {
  let updated: Project | null = null;

  updateMockDb((db) => ({
    ...db,
    projects: db.projects.map((p) => {
      if (p.id !== projectId || p.companyId !== companyId) return p;
      updated = normalizeProject({
        ...p,
        ...input,
        progressPct:
          input.progressPct ?? p.progressPct ?? 0,
        updatedAt: nowIso(),
      });
      return updated;
    }),
  }));

  return updated;
}

export async function updateProjectProgressPct(
  projectId: string,
  companyId: string,
  progressPct: number,
): Promise<Project | null> {
  let updated: Project | null = null;
  const clamped = Math.min(100, Math.max(0, Math.round(progressPct)));

  updateMockDb((db) => ({
    ...db,
    projects: db.projects.map((p) => {
      if (p.id !== projectId || p.companyId !== companyId) return p;
      updated = normalizeProject({
        ...p,
        progressPct: clamped,
        updatedAt: nowIso(),
      });
      return updated;
    }),
  }));

  return updated;
}

export async function getProjectFinanceSummary(
  projectId: string,
  role: UserRole,
): Promise<ProjectFinanceSummary | null> {
  const db = readMockDb();
  const project = db.projects.find((p) => p.id === projectId);
  if (!project) return null;

  const materialsKes = db.materials
    .filter((m) => m.projectId === projectId)
    .reduce((sum, m) => sum + materialTotalKes(m), 0);

  const labourKes = db.labour
    .filter((l) => l.projectId === projectId)
    .reduce((sum, l) => sum + l.amountKes, 0);

  const deliveriesKes = db.deliveries
    .filter((d) => d.projectId === projectId)
    .reduce((sum, d) => sum + d.deliveryFeeKes, 0);

  const totalSpentKes = materialsKes + labourKes + deliveriesKes;
  const remainingBudgetKes = project.budgetKes - totalSpentKes;
  const runningProfitKes = project.contractValueKes - totalSpentKes;
  const marginPct =
    project.contractValueKes > 0
      ? (runningProfitKes / project.contractValueKes) * 100
      : 0;

  const summary: ProjectFinanceSummary = {
    projectId,
    contractValueKes: project.contractValueKes,
    budgetKes: project.budgetKes,
    materialsKes,
    labourKes,
    deliveriesKes,
    totalSpentKes,
    remainingBudgetKes,
    runningProfitKes: role === "owner" ? runningProfitKes : null,
    marginPct: role === "owner" ? marginPct : null,
  };

  return summary;
}

export async function getProjectCostBreakdown(
  projectId: string,
): Promise<ProjectCostBreakdown | null> {
  const db = readMockDb();
  const project = db.projects.find((p) => p.id === projectId);
  if (!project) return null;

  const materials = db.materials.filter((m) => m.projectId === projectId);
  const labour = db.labour.filter((l) => l.projectId === projectId);
  const deliveries = db.deliveries.filter((d) => d.projectId === projectId);

  return {
    projectId,
    materialsByName: aggregateLines(
      materials.map((m) => ({
        key: m.name.toLowerCase(),
        label: m.name,
        amountKes: materialTotalKes(m),
      })),
    ),
    materialsBySupplier: aggregateLines(
      materials.map((m) => ({
        key: m.supplier.toLowerCase(),
        label: m.supplier,
        amountKes: materialTotalKes(m),
      })),
    ),
    labourByRole: aggregateLines(
      labour.map((l) => ({
        key: l.roleLabel.toLowerCase(),
        label: l.roleLabel,
        amountKes: l.amountKes,
      })),
    ),
    deliveriesByItem: aggregateLines(
      deliveries.map((d) => ({
        key: d.itemDescription.toLowerCase(),
        label: d.itemDescription,
        amountKes: d.deliveryFeeKes,
      })),
    ),
  };
}

export async function getProjectPulse(
  projectId: string,
  role: UserRole,
): Promise<ProjectPulse | null> {
  const finance = await getProjectFinanceSummary(projectId, role);
  const project = readMockDb().projects.find((p) => p.id === projectId);
  if (!finance || !project) return null;

  const normalized = normalizeProject(project);
  const used = budgetUsedPct(finance.totalSpentKes, finance.budgetKes);
  const { pace, message } = spendPace(used, normalized.progressPct);

  const db = readMockDb();
  const spendDates = [
    ...db.materials
      .filter((m) => m.projectId === projectId)
      .map((m) => dateKey(m.date)),
    ...db.labour
      .filter((l) => l.projectId === projectId)
      .map((l) => dateKey(l.date)),
    ...db.deliveries
      .filter((d) => d.projectId === projectId)
      .map((d) => dateKey(d.date)),
  ].sort();
  const latestDay = spendDates.at(-1) ?? dateKey(nowIso());
  const month = monthKey(latestDay);

  const todaySpentKes =
    db.materials
      .filter((m) => m.projectId === projectId && dateKey(m.date) === latestDay)
      .reduce((sum, m) => sum + materialTotalKes(m), 0) +
    db.labour
      .filter((l) => l.projectId === projectId && dateKey(l.date) === latestDay)
      .reduce((sum, l) => sum + l.amountKes, 0) +
    db.deliveries
      .filter((d) => d.projectId === projectId && dateKey(d.date) === latestDay)
      .reduce((sum, d) => sum + d.deliveryFeeKes, 0);

  const monthSpentKes =
    db.materials
      .filter((m) => m.projectId === projectId && monthKey(m.date) === month)
      .reduce((sum, m) => sum + materialTotalKes(m), 0) +
    db.labour
      .filter((l) => l.projectId === projectId && monthKey(l.date) === month)
      .reduce((sum, l) => sum + l.amountKes, 0) +
    db.deliveries
      .filter((d) => d.projectId === projectId && monthKey(d.date) === month)
      .reduce((sum, d) => sum + d.deliveryFeeKes, 0);

  const latest = db.progress
    .filter((p) => p.projectId === projectId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0];

  return {
    projectId,
    finance,
    progressPct: normalized.progressPct,
    budgetUsedPct: used,
    spendPace: pace,
    riskMessage: role === "owner" ? message : null,
    todaySpentKes,
    monthSpentKes,
    latestProgressTitle: latest?.title ?? null,
    latestProgressAt: latest?.createdAt ?? null,
  };
}

export async function getCompanyOverview(companyId: string) {
  const projects = await getProjects(companyId);
  const active = projects.filter((p) => p.status === "active");

  let totalBudget = 0;
  let totalSpent = 0;
  let totalContract = 0;

  for (const project of projects) {
    const finance = await getProjectFinanceSummary(project.id, "owner");
    totalBudget += project.budgetKes;
    totalContract += project.contractValueKes;
    totalSpent += finance?.totalSpentKes ?? 0;
  }

  return {
    projectCount: projects.length,
    activeCount: active.length,
    totalBudgetKes: totalBudget,
    totalSpentKes: totalSpent,
    totalContractKes: totalContract,
    remainingBudgetKes: totalBudget - totalSpent,
  };
}

export async function getProjectActivities(
  projectId: string,
  limit = 12,
): Promise<ProjectActivity[]> {
  return readMockDb()
    .activities.filter((a) => a.projectId === projectId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit);
}

export async function getProjectProgress(
  projectId: string,
  limit = 20,
): Promise<ProgressUpdate[]> {
  return readMockDb()
    .progress.filter((p) => p.projectId === projectId)
    .map(normalizeProgress)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit);
}

export async function getRecentCompanyProgress(
  companyId: string,
  limit = 6,
): Promise<Array<ProgressUpdate & { projectName: string }>> {
  const db = readMockDb();
  const projectIds = new Set(
    db.projects.filter((p) => p.companyId === companyId).map((p) => p.id),
  );
  const nameById = Object.fromEntries(
    db.projects.map((p) => [p.id, p.name] as const),
  );

  return db.progress
    .filter((p) => projectIds.has(p.projectId))
    .map(normalizeProgress)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit)
    .map((row) => ({
      ...row,
      projectName: nameById[row.projectId] ?? "Project",
    }));
}

function normalizeProgress(row: ProgressUpdate): ProgressUpdate {
  return {
    ...row,
    mediaFiles: Array.isArray(row.mediaFiles) ? row.mediaFiles : [],
    photoCount: row.photoCount ?? 0,
    videoCount: row.videoCount ?? 0,
  };
}

export async function getMaterials(projectId: string): Promise<MaterialEntry[]> {
  return readMockDb()
    .materials.filter((m) => m.projectId === projectId)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function addMaterial(
  user: SessionUser,
  projectId: string,
  input: {
    name: string;
    quantity: number;
    unit: string;
    unitPriceKes: number;
    supplier: string;
    date: string;
  },
): Promise<MaterialEntry> {
  const entry: MaterialEntry = {
    id: createId("mat"),
    projectId,
    companyId: user.companyId,
    ...input,
    createdAt: nowIso(),
    createdByUserId: user.userId,
    createdByName: user.name,
  };

  updateMockDb((db) => ({
    ...db,
    materials: [entry, ...db.materials],
  }));
  touchProject(projectId);
  pushActivity({
    projectId,
    kind: "material",
    title: entry.name,
    detail: `${entry.quantity} ${entry.unit} · ${entry.supplier}`,
    amountKes: materialTotalKes(entry),
    createdByName: user.name,
  });

  return entry;
}

export async function updateMaterial(
  id: string,
  input: {
    name: string;
    quantity: number;
    unit: string;
    unitPriceKes: number;
    supplier: string;
    date: string;
  },
): Promise<MaterialEntry | null> {
  const existing = readMockDb().materials.find((row) => row.id === id);
  if (!existing) return null;
  const updated: MaterialEntry = { ...existing, ...input };
  updateMockDb((db) => ({
    ...db,
    materials: db.materials.map((row) => (row.id === id ? updated : row)),
  }));
  touchProject(updated.projectId);
  return updated;
}

export async function deleteMaterial(id: string): Promise<boolean> {
  const row = readMockDb().materials.find((m) => m.id === id);
  if (!row) return false;
  updateMockDb((db) => ({
    ...db,
    materials: db.materials.filter((m) => m.id !== id),
  }));
  touchProject(row.projectId);
  return true;
}

export async function getLabour(projectId: string): Promise<LabourPayment[]> {
  return readMockDb()
    .labour.filter((l) => l.projectId === projectId)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function addLabour(
  user: SessionUser,
  projectId: string,
  input: {
    workerName: string;
    roleLabel: string;
    amountKes: number;
    paymentType: LabourPayment["paymentType"];
    date: string;
    workerId?: string | null;
  },
): Promise<LabourPayment> {
  const entry: LabourPayment = {
    id: createId("lab"),
    projectId,
    companyId: user.companyId,
    workerName: input.workerName,
    roleLabel: input.roleLabel,
    amountKes: input.amountKes,
    paymentType: input.paymentType,
    date: input.date,
    workerId: input.workerId ?? null,
    createdAt: nowIso(),
    createdByUserId: user.userId,
    createdByName: user.name,
  };

  updateMockDb((db) => ({
    ...db,
    labour: [entry, ...db.labour],
  }));
  touchProject(projectId);
  pushActivity({
    projectId,
    kind: "labour",
    title: entry.workerName,
    detail: `${entry.roleLabel} · ${entry.paymentType}`,
    amountKes: entry.amountKes,
    createdByName: user.name,
  });

  return entry;
}

export async function updateLabour(
  id: string,
  input: {
    workerName: string;
    roleLabel: string;
    amountKes: number;
    paymentType: LabourPayment["paymentType"];
    date: string;
    workerId?: string | null;
  },
): Promise<LabourPayment | null> {
  const existing = readMockDb().labour.find((row) => row.id === id);
  if (!existing) return null;
  const updated: LabourPayment = {
    ...existing,
    ...input,
    workerId: input.workerId ?? existing.workerId ?? null,
  };
  updateMockDb((db) => ({
    ...db,
    labour: db.labour.map((row) => (row.id === id ? updated : row)),
  }));
  touchProject(updated.projectId);
  return updated;
}

export async function deleteLabour(id: string): Promise<boolean> {
  const row = readMockDb().labour.find((l) => l.id === id);
  if (!row) return false;
  updateMockDb((db) => ({
    ...db,
    labour: db.labour.filter((l) => l.id !== id),
  }));
  touchProject(row.projectId);
  return true;
}

export async function getWorkers(projectId: string): Promise<ProjectWorker[]> {
  return readMockDb()
    .workers.filter((w) => w.projectId === projectId)
    .sort((a, b) => {
      const statusRank = { active: 0, paused: 1, completed: 2 };
      const byStatus = statusRank[a.status] - statusRank[b.status];
      if (byStatus !== 0) return byStatus;
      return a.name.localeCompare(b.name);
    });
}

export async function addWorker(
  user: SessionUser,
  projectId: string,
  input: {
    name: string;
    trade: string;
    roleLabel: string;
    payBasis: WorkerPayBasis;
    rateKes: number;
    phone: string | null;
    status: WorkerStatus;
    startDate: string;
    notes: string | null;
  },
): Promise<ProjectWorker> {
  const entry: ProjectWorker = {
    id: createId("wrk"),
    projectId,
    companyId: user.companyId,
    ...input,
    createdAt: nowIso(),
    createdByUserId: user.userId,
    createdByName: user.name,
  };

  updateMockDb((db) => ({
    ...db,
    workers: [entry, ...db.workers],
  }));
  touchProject(projectId);
  pushActivity({
    projectId,
    kind: "workforce",
    title: `Added ${entry.name}`,
    detail: `${entry.trade} · ${entry.roleLabel} · ${entry.payBasis}`,
    createdByName: user.name,
  });

  return entry;
}

export async function updateWorker(
  id: string,
  input: {
    name: string;
    trade: string;
    roleLabel: string;
    payBasis: WorkerPayBasis;
    rateKes: number;
    phone: string | null;
    status: WorkerStatus;
    startDate: string;
    notes: string | null;
  },
): Promise<ProjectWorker | null> {
  const existing = readMockDb().workers.find((row) => row.id === id);
  if (!existing) return null;
  const updated: ProjectWorker = { ...existing, ...input };
  updateMockDb((db) => ({
    ...db,
    workers: db.workers.map((row) => (row.id === id ? updated : row)),
  }));
  touchProject(updated.projectId);
  return updated;
}

export async function deleteWorker(id: string): Promise<boolean> {
  const row = readMockDb().workers.find((w) => w.id === id);
  if (!row) return false;
  updateMockDb((db) => ({
    ...db,
    workers: db.workers.filter((w) => w.id !== id),
  }));
  touchProject(row.projectId);
  return true;
}

export async function getVehicles(projectId: string): Promise<Vehicle[]> {
  return readMockDb()
    .vehicles.filter((v) => v.projectId === projectId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function addVehicle(
  user: SessionUser,
  projectId: string,
  input: {
    plateNumber: string;
    label: string;
    kind: Vehicle["kind"];
  },
): Promise<Vehicle> {
  const entry: Vehicle = {
    id: createId("veh"),
    projectId,
    companyId: user.companyId,
    ...input,
    createdAt: nowIso(),
    createdByUserId: user.userId,
    createdByName: user.name,
  };

  updateMockDb((db) => ({
    ...db,
    vehicles: [entry, ...db.vehicles],
  }));
  touchProject(projectId);
  pushActivity({
    projectId,
    kind: "vehicle",
    title: `${entry.plateNumber} registered`,
    detail: `${entry.label} · ${entry.kind}`,
    createdByName: user.name,
  });

  return entry;
}

export async function getDeliveries(projectId: string): Promise<Delivery[]> {
  return readMockDb()
    .deliveries.filter((d) => d.projectId === projectId)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function addDelivery(
  user: SessionUser,
  projectId: string,
  input: {
    itemDescription: string;
    quantity: number;
    unit: string;
    deliveryFeeKes: number;
    date: string;
    receivedBy: string;
    vehicleId: string | null;
  },
): Promise<Delivery> {
  const vehicles = readMockDb().vehicles;
  const vehicle = input.vehicleId
    ? vehicles.find((v) => v.id === input.vehicleId)
    : null;

  const entry: Delivery = {
    id: createId("del"),
    projectId,
    companyId: user.companyId,
    itemDescription: input.itemDescription,
    quantity: input.quantity,
    unit: input.unit,
    deliveryFeeKes: input.deliveryFeeKes,
    date: input.date,
    receivedBy: input.receivedBy,
    vehicleId: vehicle?.id ?? null,
    vehicleLabel: vehicle
      ? `${vehicle.plateNumber} · ${vehicle.label}`
      : "No vehicle linked",
    createdAt: nowIso(),
    createdByUserId: user.userId,
    createdByName: user.name,
  };

  updateMockDb((db) => ({
    ...db,
    deliveries: [entry, ...db.deliveries],
  }));
  touchProject(projectId);
  pushActivity({
    projectId,
    kind: "delivery",
    title: entry.itemDescription,
    detail: `${entry.quantity} ${entry.unit} · ${entry.vehicleLabel}`,
    amountKes: entry.deliveryFeeKes,
    createdByName: user.name,
  });

  return entry;
}

export async function updateDelivery(
  id: string,
  input: {
    itemDescription: string;
    quantity: number;
    unit: string;
    deliveryFeeKes: number;
    date: string;
    receivedBy: string;
    vehicleId: string | null;
  },
): Promise<Delivery | null> {
  const existing = readMockDb().deliveries.find((row) => row.id === id);
  if (!existing) return null;
  const vehicles = readMockDb().vehicles;
  const vehicle = input.vehicleId
    ? vehicles.find((v) => v.id === input.vehicleId)
    : null;

  const updated: Delivery = {
    ...existing,
    itemDescription: input.itemDescription,
    quantity: input.quantity,
    unit: input.unit,
    deliveryFeeKes: input.deliveryFeeKes,
    date: input.date,
    receivedBy: input.receivedBy,
    vehicleId: vehicle?.id ?? null,
    vehicleLabel: vehicle
      ? `${vehicle.plateNumber} · ${vehicle.label}`
      : "No vehicle linked",
  };

  updateMockDb((db) => ({
    ...db,
    deliveries: db.deliveries.map((row) => (row.id === id ? updated : row)),
  }));
  touchProject(updated.projectId);
  return updated;
}

export async function deleteDelivery(id: string): Promise<boolean> {
  const row = readMockDb().deliveries.find((d) => d.id === id);
  if (!row) return false;
  updateMockDb((db) => ({
    ...db,
    deliveries: db.deliveries.filter((d) => d.id !== id),
  }));
  touchProject(row.projectId);
  return true;
}

export async function addProgress(
  user: SessionUser,
  projectId: string,
  input: {
    title: string;
    description: string;
    mediaFiles?: ProgressMedia[];
    photoCount?: number;
    videoCount?: number;
    linkedDeliveryId?: string | null;
  },
): Promise<ProgressUpdate> {
  const mediaFiles = input.mediaFiles ?? [];
  const photoCount =
    mediaFiles.length > 0
      ? mediaFiles.filter((f) => f.kind === "image").length
      : (input.photoCount ?? 0);
  const videoCount =
    mediaFiles.length > 0
      ? mediaFiles.filter((f) => f.kind === "video").length
      : (input.videoCount ?? 0);

  const mediaParts: string[] = [];
  if (photoCount > 0) {
    mediaParts.push(`${photoCount} photo${photoCount === 1 ? "" : "s"}`);
  }
  if (videoCount > 0) {
    mediaParts.push(`${videoCount} video${videoCount === 1 ? "" : "s"}`);
  }

  const delivery = input.linkedDeliveryId
    ? readMockDb().deliveries.find((d) => d.id === input.linkedDeliveryId)
    : null;

  const entry: ProgressUpdate = {
    id: createId("prg"),
    projectId,
    title: input.title,
    description: input.description,
    createdAt: nowIso(),
    createdByName: user.name,
    mediaLabel: mediaParts.join(" · ") || "No media",
    photoCount,
    videoCount,
    mediaFiles,
    linkedDeliveryId: delivery?.id ?? null,
    linkedDeliveryLabel: delivery
      ? `${delivery.itemDescription} · ${delivery.date}`
      : null,
  };

  updateMockDb((db) => ({
    ...db,
    progress: [entry, ...db.progress],
  }));
  touchProject(projectId);
  pushActivity({
    projectId,
    kind: "progress",
    title: entry.title,
    detail: entry.linkedDeliveryLabel
      ? `${entry.mediaLabel} · linked to ${entry.linkedDeliveryLabel}`
      : entry.mediaLabel,
    createdByName: user.name,
  });

  return entry;
}

export async function getMembers(projectId: string): Promise<ProjectMember[]> {
  return readMockDb()
    .members.filter((m) => m.projectId === projectId)
    .sort((a, b) => +new Date(b.invitedAt) - +new Date(a.invitedAt));
}

export async function getCompanyPeople(
  companyId: string,
): Promise<CompanyPerson[]> {
  return readMockDb()
    .people.filter((p) => p.companyId === companyId)
    .sort((a, b) => +new Date(b.invitedAt) - +new Date(a.invitedAt));
}

function upsertPersonAndMember(
  user: SessionUser,
  projectIds: string[],
  input: {
    name: string;
    email: string;
    role: ProjectMember["role"];
  },
): { person: CompanyPerson; members: ProjectMember[] } {
  const email = input.email.trim().toLowerCase();
  const db = readMockDb();
  const existing = db.people.find((p) => p.email.toLowerCase() === email);
  const userId = existing?.userId ?? createId("usr");
  const personId = existing?.id ?? createId("ppl");
  const mergedProjectIds = Array.from(
    new Set([...(existing?.projectIds ?? []), ...projectIds]),
  );

  const person: CompanyPerson = {
    id: personId,
    companyId: user.companyId,
    userId,
    name: input.name.trim(),
    email: input.email.trim(),
    role: input.role,
    status: existing?.status ?? "invited",
    projectIds: mergedProjectIds,
    invitedAt: existing?.invitedAt ?? nowIso(),
    createdByUserId: existing?.createdByUserId ?? user.userId,
  };

  const members: ProjectMember[] = [];
  for (const projectId of projectIds) {
    const already = db.members.some(
      (m) =>
        m.projectId === projectId && m.email.toLowerCase() === email,
    );
    if (already) continue;
    members.push({
      id: createId("mem"),
      projectId,
      companyId: user.companyId,
      name: person.name,
      email: person.email,
      role: person.role,
      status: person.status,
      invitedAt: nowIso(),
      createdByUserId: user.userId,
      userId: person.userId,
    });
  }

  updateMockDb((prev) => {
    const withoutPerson = prev.people.filter((p) => p.id !== person.id);
    return {
      ...prev,
      people: [person, ...withoutPerson],
      members: [...members, ...prev.members],
    };
  });

  return { person, members };
}

export async function inviteMember(
  user: SessionUser,
  projectId: string,
  input: {
    name: string;
    email: string;
    role: ProjectMember["role"];
  },
): Promise<ProjectMember> {
  const { person, members } = upsertPersonAndMember(user, [projectId], input);
  touchProject(projectId);
  pushActivity({
    projectId,
    kind: "team",
    title: `Invited ${person.name}`,
    detail: `${person.role} · ${person.email}`,
    createdByName: user.name,
  });

  const created = members[0];
  if (created) return created;

  const existing = readMockDb().members.find(
    (m) =>
      m.projectId === projectId &&
      m.email.toLowerCase() === input.email.trim().toLowerCase(),
  );
  if (!existing) {
    throw new Error("Failed to invite member");
  }
  return existing;
}

/** Org-level invite: create person and assign to one or more projects. */
export async function inviteCompanyPerson(
  user: SessionUser,
  input: {
    name: string;
    email: string;
    role: ProjectMember["role"];
    projectIds: string[];
  },
): Promise<CompanyPerson> {
  const { person } = upsertPersonAndMember(user, input.projectIds, input);
  for (const projectId of input.projectIds) {
    touchProject(projectId);
    pushActivity({
      projectId,
      kind: "team",
      title: `Invited ${person.name}`,
      detail: `${person.role} · ${person.email}`,
      createdByName: user.name,
    });
  }
  return person;
}

export async function assignPersonToProject(
  user: SessionUser,
  personId: string,
  projectId: string,
): Promise<CompanyPerson | null> {
  const db = readMockDb();
  const person = db.people.find((p) => p.id === personId);
  if (!person || person.companyId !== user.companyId) return null;
  if (person.projectIds.includes(projectId)) return person;

  upsertPersonAndMember(user, [projectId], {
    name: person.name,
    email: person.email,
    role: person.role,
  });
  touchProject(projectId);
  pushActivity({
    projectId,
    kind: "team",
    title: `Assigned ${person.name}`,
    detail: `${person.role} · ${person.email}`,
    createdByName: user.name,
  });

  return (
    readMockDb().people.find((p) => p.id === personId) ?? null
  );
}
