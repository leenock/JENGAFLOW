"use client";

import type {
  CompanyPerson,
  Delivery,
  LabourPayment,
  MaterialEntry,
  ProgressUpdate,
  Project,
  ProjectActivity,
  ProjectMember,
  ProjectWorker,
  Vehicle,
} from "@/types/domain";
import {
  MOCK_ACTIVITIES,
  MOCK_DELIVERIES,
  MOCK_LABOUR,
  MOCK_MATERIALS,
  MOCK_MEMBERS,
  MOCK_PEOPLE,
  MOCK_PROGRESS,
  MOCK_PROJECTS,
  MOCK_VEHICLES,
  MOCK_WORKERS,
} from "./data";

const STORAGE_KEY = "jengaflow.mock.v4";
const CHANGE_EVENT = "jengaflow:mock-db";

export type MockDatabase = {
  version: 4;
  projects: Project[];
  materials: MaterialEntry[];
  labour: LabourPayment[];
  deliveries: Delivery[];
  vehicles: Vehicle[];
  progress: ProgressUpdate[];
  members: ProjectMember[];
  people: CompanyPerson[];
  workers: ProjectWorker[];
  activities: ProjectActivity[];
};

function seedDatabase(): MockDatabase {
  return {
    version: 4,
    projects: structuredClone(MOCK_PROJECTS),
    materials: structuredClone(MOCK_MATERIALS),
    labour: structuredClone(MOCK_LABOUR),
    deliveries: structuredClone(MOCK_DELIVERIES),
    vehicles: structuredClone(MOCK_VEHICLES),
    progress: structuredClone(MOCK_PROGRESS),
    members: structuredClone(MOCK_MEMBERS),
    people: structuredClone(MOCK_PEOPLE),
    workers: structuredClone(MOCK_WORKERS),
    activities: structuredClone(MOCK_ACTIVITIES),
  };
}

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function readMockDb(): MockDatabase {
  if (typeof window === "undefined") {
    return seedDatabase();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedDatabase();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as MockDatabase;
    if (parsed.version !== 4 || !Array.isArray(parsed.workers)) {
      const seeded = seedDatabase();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    const seeded = seedDatabase();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function writeMockDb(db: MockDatabase): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  notify();
}

export function updateMockDb(
  updater: (db: MockDatabase) => MockDatabase,
): MockDatabase {
  const next = updater(readMockDb());
  writeMockDb(next);
  return next;
}

export function subscribeMockDb(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function resetMockDb(): void {
  writeMockDb(seedDatabase());
}
