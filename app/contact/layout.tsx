import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Jengaflow",
  description: "Get in touch about early access, demos, or partnerships.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
