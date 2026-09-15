Yes. If you mean **the development tools/technology we should use to build this system**, I’d structure the MVP like this:

### Development Stack

**Frontend + Application**

- **Next.js + TypeScript** — main application
- **Tailwind CSS** — styling
- **shadcn/ui** — reusable UI components
- **React Hook Form + Zod** — forms and validation

**Backend**

- **Next.js Server Actions / API Routes** — backend logic
- **Prisma** — database ORM
- **PostgreSQL** — main database
- **Auth.js** — authentication and sessions

I would **not use a separate Express backend initially**. Next.js can handle the MVP backend, which keeps the system simpler.

### Photos & Videos

For the construction progress feature, we need proper media storage rather than putting photos/videos directly in PostgreSQL.

I'd use:

- **Cloudinary** — photos and videos
- Store the returned media URL and metadata in PostgreSQL
- Automatic image optimisation
- Video upload and streaming
- Generate thumbnails for progress videos

A progress record could look conceptually like:

> **12 September 2026 — Foundation Progress**
> Uploaded by: John — Foreman
> Photos: 6
> Video: 1
> Description: Foundation work completed for Block A.

Then the owner can open the project and see a **visual timeline** of construction progress.

### File/Document Storage

For things such as:

- Receipts
- Invoices
- Purchase documents
- PDF reports
- Other project documents

We can use **Cloudinary initially**, or later move these to **S3-compatible storage** if the document requirements become larger.

### Charts & Dashboard

- **Recharts** — spending charts and project statistics

For example:

**Project Spending**

Materials — KES 2.1M
Labour — KES 1.5M
Deliveries — KES 250K

And:

**Budget:** KES 7.5M
**Spent:** KES 3.85M
**Remaining:** KES 3.65M

### Reports

- **CSV** — straightforward export from the database
- **PDF** — `@react-pdf/renderer` or server-side PDF generation

A project report could contain:

> Project details → Financial summary → Materials → Labour → Deliveries → Vehicles → Progress updates → Photos



### Email & Invitations

For inviting clerks/foremen:

- **Resend** — email invitations and notifications

For example:

> You have been invited to join **Karen Residential Project** as a Site Clerk.



### Hosting

For the first version:

- **Vercel** — Next.js application
- **Managed PostgreSQL** — Neon, Supabase, or another PostgreSQL provider
- **Cloudinary** — photos/videos
- **Resend** — email
- **GitHub** — source control



### Development Tools

For actually developing it:

- **VS Code**
- **Git + GitHub**
- **pnpm**
- **Prisma Studio** — database management during development
- **Postman/Insomnia** — API testing if needed
- **Chrome DevTools**
- **ESLint + Prettier**



### Recommended MVP Architecture

```text
                    CONSTRUCTION TRACKER
                            │
                     Next.js Application
                            │
              ┌─────────────┴─────────────┐
              │                           │
        Web / Mobile UI              Server Logic
        Next.js + Tailwind            Server Actions
        shadcn/ui                     API Routes
              │                           │
              └─────────────┬─────────────┘
                            │
                         Prisma
                            │
                       PostgreSQL
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
     Companies            Sites              Users
     Projects             Costs             Roles
     Vehicles             Activity           Members
                            │
                  ┌─────────┴─────────┐
                  │                   │
             Cloudinary            Resend
             Photos/Videos          Email
```

And importantly, because this is a **multi-tenant SaaS**, every piece of project data needs to belong to a company:

```text
Company
 ├── Users
 ├── Sites
 │    ├── Materials
 │    ├── Labour
 │    ├── Deliveries
 │    ├── Vehicles
 │    ├── Progress Updates
 │    │     ├── Photos
 │    │     └── Videos
 │    └── Activity
 └── Invitations
```

I would build the MVP around **Next.js + PostgreSQL + Prisma + Cloudinary**, keeping the architecture simple enough for you to develop and deploy without introducing unnecessary separate services.