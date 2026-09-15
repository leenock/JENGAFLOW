import type { Metadata } from "next";
import LoginPage from "./login-client";

export const metadata: Metadata = {
  title: "Log in — Jengaflow",
  description: "Log in to your Jengaflow owner dashboard or site capture workspace.",
};

export default function Page() {
  return <LoginPage />;
}
