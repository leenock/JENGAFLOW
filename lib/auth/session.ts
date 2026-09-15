"use client";

import type { SessionUser, UserRole } from "@/types/domain";
import { MOCK_COMPANY } from "@/lib/mock/data";
import { readMockDb, updateMockDb } from "@/lib/mock/store";

const STORAGE_KEY = "jengaflow.session.v1";
const OWNER_PROFILE_KEY = "jengaflow.owner-profile.v1";

export const DEMO_OWNER: SessionUser = {
  userId: "usr_owner_1",
  companyId: MOCK_COMPANY.id,
  role: "owner",
  name: "Grace Wanjiku",
  email: "grace@ridgeview.ke",
  companyName: MOCK_COMPANY.name,
};

export const DEMO_LOGIN_HINTS = [
  { email: "grace@ridgeview.ke", role: "Owner" },
  { email: "james@ridgeview.ke", role: "Clerk (Kilimani)" },
  { email: "mary@ridgeview.ke", role: "Foreman (Kilimani)" },
  { email: "peter@ridgeview.ke", role: "Clerk (Syokimau)" },
] as const;

type OwnerProfile = {
  name: string;
  email: string;
  companyName: string;
};

function readOwnerProfile(): OwnerProfile {
  if (typeof window === "undefined") {
    return {
      name: DEMO_OWNER.name,
      email: DEMO_OWNER.email,
      companyName: DEMO_OWNER.companyName,
    };
  }
  try {
    const raw = window.localStorage.getItem(OWNER_PROFILE_KEY);
    if (!raw) {
      return {
        name: DEMO_OWNER.name,
        email: DEMO_OWNER.email,
        companyName: DEMO_OWNER.companyName,
      };
    }
    const parsed = JSON.parse(raw) as OwnerProfile;
    return {
      name: parsed.name?.trim() || DEMO_OWNER.name,
      email: parsed.email?.trim() || DEMO_OWNER.email,
      companyName: parsed.companyName?.trim() || DEMO_OWNER.companyName,
    };
  } catch {
    return {
      name: DEMO_OWNER.name,
      email: DEMO_OWNER.email,
      companyName: DEMO_OWNER.companyName,
    };
  }
}

function writeOwnerProfile(profile: OwnerProfile): void {
  window.localStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(profile));
}

function sessionFromOwner(profile: OwnerProfile = readOwnerProfile()): SessionUser {
  return {
    ...DEMO_OWNER,
    name: profile.name,
    email: profile.email,
    companyName: profile.companyName,
  };
}

export function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function writeSession(user: SessionUser): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("jengaflow:session"));
}

/** Stub login — accepts any credentials, signs in as demo owner. */
export function signInAsOwner(input?: {
  name?: string;
  email?: string;
  companyName?: string;
}): SessionUser {
  const profile: OwnerProfile = {
    name: input?.name?.trim() || DEMO_OWNER.name,
    email: input?.email?.trim() || DEMO_OWNER.email,
    companyName: input?.companyName?.trim() || DEMO_OWNER.companyName,
  };
  writeOwnerProfile(profile);
  const user = sessionFromOwner(profile);
  writeSession(user);
  return user;
}

/**
 * Demo auth: match owner or an invited company person by email.
 * Any password is accepted in the frontend stub.
 */
export function signInWithEmail(emailRaw: string): SessionUser | null {
  const email = emailRaw.trim().toLowerCase();
  if (!email) return null;

  const owner = readOwnerProfile();
  if (
    email === owner.email.toLowerCase() ||
    email === DEMO_OWNER.email.toLowerCase()
  ) {
    const signedIn = sessionFromOwner(owner);
    writeSession(signedIn);
    return signedIn;
  }

  const person = readMockDb().people.find(
    (p) => p.email.toLowerCase() === email,
  );
  if (!person) return null;

  if (person.status === "invited") {
    updateMockDb((db) => ({
      ...db,
      people: db.people.map((p) =>
        p.id === person.id ? { ...p, status: "active" } : p,
      ),
      members: db.members.map((m) =>
        m.email.toLowerCase() === email ? { ...m, status: "active" } : m,
      ),
    }));
  }

  const user: SessionUser = {
    userId: person.userId,
    companyId: person.companyId,
    role: person.role,
    name: person.name,
    email: person.email,
    companyName: readOwnerProfile().companyName,
  };
  writeSession(user);
  return user;
}

export type ProfileUpdateInput = {
  name: string;
  email: string;
  companyName?: string;
};

/**
 * Update the signed-in profile. Owners may change org display name.
 * Site roles sync name/email into People / project member records.
 */
export function updateProfile(input: ProfileUpdateInput): SessionUser | null {
  const current = readSession();
  if (!current) return null;

  const name = input.name.trim();
  const email = input.email.trim();
  if (!name || !email) return null;

  if (current.role === "owner") {
    const companyName =
      input.companyName?.trim() || current.companyName || MOCK_COMPANY.name;
    const profile: OwnerProfile = { name, email, companyName };
    writeOwnerProfile(profile);
    const user = sessionFromOwner(profile);
    writeSession(user);
    return user;
  }

  const emailTaken = readMockDb().people.some(
    (p) =>
      p.userId !== current.userId &&
      p.email.toLowerCase() === email.toLowerCase(),
  );
  if (emailTaken) return null;

  updateMockDb((db) => ({
    ...db,
    people: db.people.map((p) =>
      p.userId === current.userId ? { ...p, name, email } : p,
    ),
    members: db.members.map((m) =>
      m.userId === current.userId ? { ...m, name, email } : m,
    ),
  }));

  const user: SessionUser = {
    ...current,
    name,
    email,
  };
  writeSession(user);
  return user;
}

export function homePathForRole(role: UserRole): string {
  return role === "owner" ? "/dashboard" : "/workspace";
}

export function signOut(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("jengaflow:session"));
}
