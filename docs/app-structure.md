# Product app structure

```text
app/(app)/
  layout.tsx
  dashboard/page.tsx
  projects/new/page.tsx
  projects/[projectId]/
    layout.tsx              # header + sub-nav
    page.tsx                # overview (finance + diary + activity)
    edit/page.tsx
    materials|labour|deliveries|vehicles|progress|team|export/
  capture/
    page.tsx                # site picker  → /workspace/capture
    [projectId]/page.tsx    # quick capture → /workspace/capture/[projectId]

# Note: marketing keeps public /capture ("What you capture").
# Product capture lives under /workspace/capture to avoid route collision.

features/projects/components/
lib/auth/                   # session stub + permissions
lib/mock/
  data.ts                   # seed
  store.ts                  # localStorage DB (tenant-scoped in records)
  projects.ts               # service API — swap for Prisma later
types/domain.ts
```

Finance is computed from materials + labour + delivery fees. Owner-only: profit, margin, export, team invites, create project.
