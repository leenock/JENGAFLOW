"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Project, ProjectInput, SessionUser } from "@/types/domain";
import { readSession } from "@/lib/auth/session";
import { getProject, updateProject } from "@/lib/mock/projects";
import { ProjectForm } from "@/features/projects/components/project-form";
import { Panel } from "@/components/app/ui";

export default function EditProjectPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const projectId = params.projectId;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = readSession();
    setUser(session);
    if (!session || !projectId) return;
    void getProject(projectId, session.companyId).then(setProject);
  }, [projectId]);

  const onSubmit = async (input: ProjectInput) => {
    if (!user) return;
    if (user.role !== "owner") {
      setError("Only owners can edit projects.");
      return;
    }
    if (input.budgetKes > input.contractValueKes) {
      setError("Budget should not exceed contract value.");
      return;
    }
    setPending(true);
    setError(null);
    await updateProject(projectId, user.companyId, input);
    router.push(`/projects/${projectId}`);
  };

  if (!project) {
    return (
      <p className="landing-tracked text-[11px] font-medium text-jf-muted">
        Loading
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/projects/${projectId}`}
          className="landing-tracked text-[10px] font-semibold text-jf-muted no-underline hover:text-jf-ink"
        >
          ← Back to project
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-jf-ink">Edit project</h1>
      </div>
      <Panel>
        {error ? (
          <p className="mb-4 text-sm text-jf-red" role="alert">
            {error}
          </p>
        ) : null}
        <ProjectForm
          initial={project}
          submitLabel="Save changes"
          pending={pending}
          onSubmit={(input) => {
            void onSubmit(input);
          }}
        />
      </Panel>
    </div>
  );
}
