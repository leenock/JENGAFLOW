import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app/app-shell";

export const metadata: Metadata = {
  title: "Workspace — Jengaflow",
  description: "Owner workspace for construction site tracking.",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
