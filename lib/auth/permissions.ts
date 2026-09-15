import type { UserRole } from "@/types/domain";

/** Central permission checks — reuse when real auth lands. */

export function canViewFinance(role: UserRole): boolean {
  return role === "owner";
}

export function canViewProfit(role: UserRole): boolean {
  return role === "owner";
}

export function canManageProjects(role: UserRole): boolean {
  return role === "owner";
}

export function canManageTeam(role: UserRole): boolean {
  return role === "owner";
}

export function canManageVehicles(role: UserRole): boolean {
  return role === "owner" || role === "clerk" || role === "foreman";
}

export function canExportRecords(role: UserRole): boolean {
  return role === "owner";
}

export function canCaptureSiteData(role: UserRole): boolean {
  return role === "owner" || role === "clerk" || role === "foreman";
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case "owner":
      return "Owner";
    case "clerk":
      return "Clerk";
    case "foreman":
      return "Foreman";
  }
}
