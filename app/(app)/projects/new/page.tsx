"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ProjectInput } from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import { createProject } from "@/lib/mock/projects";
import { ProjectForm } from "@/features/projects/components/project-form";
import { Panel } from "@/components/app/ui";

export default function NewProjectPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (input: ProjectInput) => {
    const session = readSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== "owner") {
      setError("Only owners can create projects.");
      return;
    }
    if (input.budgetKes > input.contractValueKes) {
      setError("Budget should not exceed contract value.");
      return;
    }

    setPending(true);
    setError(null);
    const project = await createProject(session.companyId, input);
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="landing-tracked text-[10px] font-semibold text-jf-muted no-underline hover:text-jf-ink"
        >
          ← Overview
        </Link>
        <p className="landing-tracked mt-4 text-[10px] font-medium text-jf-red">
          New project
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-jf-ink md:text-3xl">
          Set up a construction site
        </h1>
        <p className="mt-2 text-sm text-jf-muted">
          Contract value and budget become the baseline for spend and running
          profit on this project.
        </p>
      </div>

      <Panel>
        {error ? (
          <p className="mb-4 text-sm text-jf-red" role="alert">
            {error}
          </p>
        ) : null}
        <ProjectForm
          submitLabel="Create project"
          pending={pending}
          onSubmit={(input) => {
            void onSubmit(input);
          }}
        />
      </Panel>
    </div>
  );
}
