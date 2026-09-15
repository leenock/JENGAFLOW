import type { Metadata } from "next";
import SignupPage from "./signup-client";

export const metadata: Metadata = {
  title: "Get started — Jengaflow",
  description:
    "Create an owner account for your construction company and start putting every site on one record.",
};

export default function Page() {
  return <SignupPage />;
}
