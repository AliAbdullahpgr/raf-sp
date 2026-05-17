# RAF-SP Platform

**Regional Agriculture Facilities — South Punjab**

An enterprise-grade, government-deployed asset management and resource intelligence platform purpose-built for the Agriculture Department of South Punjab, Pakistan. RAF-SP consolidates the operational footprint of fifteen autonomous research institutes, testing laboratories, mechanization centers, and university faculties into a single, authoritative system of record — replacing fragmented spreadsheets, paper registers, and siloed departmental archives with a unified, role-aware digital backbone.

The platform is engineered for the realities of public-sector agriculture: heterogeneous asset classes, multi-department governance, intermittent connectivity, and the need for verifiable, auditable data. It is currently in production and serves as the canonical source for equipment inventory, machinery status, laboratory capacity, human resource allocation, and infrastructure records across the region.

**Production deployment:** https://raf-sp.vercel.app

---

## Strategic Value

RAF-SP delivers measurable institutional impact across four dimensions:

- **Operational visibility.** Department heads and provincial administrators gain a real-time, status-accurate view of every tracked asset — from cotton-ginning machinery to spectrophotometers to research vehicles — eliminating the lag between ground-truth and reported state.
- **Accountability and auditability.** Every asset record, status transition, and maintenance event is attributed, timestamped, and traceable to a specific department and role, supporting both internal audits and external compliance reviews.
- **Decision support.** Aggregated analytics, status distributions, and utilization trends are surfaced through interactive dashboards, enabling evidence-based budgeting, procurement, and capacity-planning decisions.
- **Institutional continuity.** By codifying departmental inventories into a durable, queryable system, the platform protects against knowledge loss during staff transitions and creates a permanent operational record for the department.

---

## Participating Institutions

The platform is the official asset registry for the following fifteen entities:

1. Mango Research Institute (MRI)
2. Cotton Research Institute (CRI)
3. Adaptive Research Center (ARC)
4. Entomological Research Sub-Station (ERSS)
5. Agricultural Engineering
6. Agricultural Extension Wing
7. Agricultural Mechanization Research Institute (AMRI)
8. Floriculture Research Institute
9. Regional Agricultural Research Institute (RARI)
10. Regional Agricultural Economic Development Centre (RAEDC)
11. Pesticide Quality Control Laboratory
12. Soil & Water Testing Laboratory
13. Food Science & Technology Department, MNS University of Agriculture
14. Agronomy Department, MNS University of Agriculture
15. MNS University of Agriculture Estate

Each institution operates within its own data partition, with department-specific dashboards, schemas, and workflows tuned to its asset profile — while remaining fully visible to provincial-level administrators through the unified admin console.

---

## Platform Capabilities

### Authentication and Access Control

- Production-grade authentication built on NextAuth v5 with secure session management.
- Two-tier role model — `ADMIN` for provincial oversight and `DEPT_HEAD` for departmental administration — with strict route-level and API-level enforcement.
- Per-department credentialing with isolated data scope; no department can read or mutate another's records.
- Defense-in-depth protections on every server action and API endpoint.

### Department-Specific Dashboards

- Bespoke dashboards for each department class — research institutes, testing laboratories, mechanization centers, and university faculties — reflecting the distinct asset taxonomies of each.
- Live status indicators across the canonical asset states: Available, In Use, Needs Repair, Discarded, Functional, Non-Functional.
- Drill-down views from aggregate KPIs to individual asset records.
- Interactive visualizations powered by Recharts, including status distributions, trend analyses, and comparative breakdowns.

### Asset and Resource Management

- Comprehensive equipment, machinery, and infrastructure inventories with full lifecycle tracking.
- Laboratory instrumentation, research equipment, and mechanization fleet management.
- Human resource records including positions, pay scales, and departmental allocations.
- Building, facility, and land-asset documentation.

### Data Ingestion

- CSV bulk-upload pipeline with schema validation, powered by PapaParse.
- PDF parsing for legacy document-based records.
- Programmatic seeding scripts for every department, supporting reproducible deployments and disaster recovery.

### Analytics and Reporting

- Real-time aggregation across departments and asset classes.
- Status-based filtering, sorting, and export.
- Visual analytics suitable for executive briefings and inter-departmental review.

### User Experience

- Government-themed, accessibility-conscious interface built on Shadcn UI and Radix primitives.
- Fully responsive across desktop, tablet, and mobile form factors.
- Motion design via Framer Motion for clarity, not decoration.
- Consistent visual language across all departmental contexts.

---

## Technology Stack

### Application Layer

- **Framework:** Next.js 16 with React 19, leveraging the App Router, Server Components, and Server Actions.
- **Language:** TypeScript end-to-end.
- **Styling:** Tailwind CSS with a custom government design system.
- **Component library:** Shadcn UI and Radix UI primitives.
- **Forms and validation:** React Hook Form with Zod schemas, shared between client and server.
- **Data fetching:** TanStack Query for client-side state and caching.
- **Visualization:** Recharts.
- **Motion:** Framer Motion.

### Data Layer

- **Database:** PostgreSQL, hosted on Supabase.
- **ORM:** Prisma 6 with the Postgres adapter and connection pooling.
- **Authentication store:** Prisma adapter for NextAuth.
- **Document and email:** Resend for transactional mail; pdf-parse and PapaParse for ingestion.

### Infrastructure

- **Hosting:** Vercel edge deployment with automatic preview environments.
- **Database hosting:** Supabase (managed PostgreSQL).
- **CI/CD:** GitHub-integrated automatic deploys.
- **Testing:** Vitest with React Testing Library and jsdom.

---

## Prerequisites

- Node.js 18.x or higher
- npm 9 or higher
- PostgreSQL 14+ instance (Supabase recommended)
- Git

---

## Local Setup

### 1. Clone

```bash
git clone https://github.com/AliAbdullahpgr/raf-sp.git
cd raf-sp
```

### 2. Install

```bash
npm install
```

### 3. Configure environment

Create `.env.local` in the project root:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
AUTH_SECRET="your-auth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

Generate a strong `AUTH_SECRET` with `openssl rand -base64 32`.

### 4. Provision the database

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed departmental data

```bash
npm run seed
```

Department-specific seeders are available under `scripts/seed-*.ts` for granular provisioning.

### 6. Provision the administrator account

Execute `create-admin.sql` against the target database.

### 7. Run the development server

```bash
npm run dev
```

The application is then available at `http://localhost:3000`.

---

## Project Structure

```
raf-sp/
├── actions/              Server actions for data mutations
├── app/                  Next.js App Router
│   ├── (auth)/           Authentication flows
│   ├── admin/            Provincial administration console
│   ├── department/       Department-scoped dashboards
│   └── api/              API endpoints
├── components/
│   ├── departments/      Department-specific components
│   └── ui/               Shared UI primitives
├── lib/
│   └── data/             Static reference data
├── prisma/
│   └── schema.prisma     Authoritative data model
├── scripts/              Seeders and operational scripts
├── public/               Static assets
└── types/                Shared TypeScript definitions
```

---

## Credentials and Department Access

Each participating department is provisioned with a dedicated account. The complete credential matrix is documented in `DEPARTMENT_LOGIN_CREDENTIALS.md`. All accounts ship with the default password `ChangeMe123!`, which must be rotated on first login. Production deployments must replace all default credentials before going live.

---

## Operational Scripts

```bash
npm run dev               Start the development server
npm run build             Build the production bundle
npm run start             Start the production server
npm run lint              Static analysis
npm run test              Run the test suite
npm run test:watch        Run tests in watch mode
npm run seed              Seed all departments
npm run seed:ento         Seed entomology data
npm run audit:duplicates  Audit duplicate departmental records
```

---

## Deployment

The platform is optimized for Vercel and ships with zero-configuration deployment:

1. Push to the connected GitHub repository.
2. Vercel builds and deploys automatically.
3. Environment variables are managed through the Vercel dashboard.
4. Preview deployments are issued per pull request.

For self-hosted environments:

```bash
npm run build
npm run start
```

---

## Documentation

- `SUPABASE_SETUP.md` — database provisioning and connection guidance.
- `DEPARTMENT_LOGIN_CREDENTIALS.md` — full credential matrix.
- `prisma/schema.prisma` — authoritative data model.
- Inline JSDoc and TypeScript annotations across the codebase.

---

## Contributing

Contributions from departmental staff, technical partners, and the broader community are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit with clear, descriptive messages.
4. Open a pull request against `main`.

All changes are subject to review and must pass the automated test and lint pipelines.

---

## License and Ownership

This software is developed for and operated by the Agriculture Department of the Government of Punjab, Pakistan. All rights reserved.

---

## Contact

- **Repository:** https://github.com/AliAbdullahpgr/raf-sp
- **Issue tracker:** https://github.com/AliAbdullahpgr/raf-sp/issues

---

## Acknowledgments

- Agriculture Department, Government of Punjab
- Muhammad Nawaz Shareef University of Agriculture, Multan
- All participating research institutes, laboratories, and university faculties
- The engineering and operations team behind RAF-SP

---

Built for the institutions advancing agricultural research, productivity, and food security in South Punjab.
