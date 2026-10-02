# Samanvay
**Intelligent Industrial Approval & Compliance Orchestration**

Built for Smart India Hackathon 2026 by **Team CaffeineCommits**.

Samanvay (संनवय — "harmonious coordination") is a unified platform that takes an entrepreneur from "what approvals do I even need?" to a fully tracked, cross-department compliance journey — replacing fragmented, manually-coordinated industrial approvals with one coordinated system.

---

## The Problem

Setting up or running an industrial unit in India means navigating approvals from multiple, disconnected authorities — Pollution Control Boards, Fire Departments, Municipal Corporations, Factories Departments, and more — each with its own process, documentation standard, and timeline. Requirements vary by sector, location, project size, and stage of operation, and existing single-window systems (including India's National Single Window System and state portals like Maharashtra's MAITRI) still leave land titles, electricity connections, zoning, and full environmental clearance processing outside real integration.

The result: applicants struggle to identify what applies to them, submit incomplete applications, and have no reliable way to track progress — while departments face duplicated inspection effort, repetitive scrutiny, and limited visibility into where delays are actually happening.

## What Samanvay Does Differently

- **Customised, auto-generated approval checklists** — built dynamically from sector, location, and project size, not a static list
- **Live pre-validation** — flags non-compliant inputs (e.g. land size below the statutory minimum) against government thresholds before submission, with the specific guideline cited
- **Cross-department orchestration** — tracks sequential vs. parallel approval dependencies instead of treating every approval as independent
- **Common inspection planning** — automatically clubs multiple departments' site-visit requirements into a single joint inspection instead of scheduling them separately
- **SLA & responsibility engine** — every approval carries a real deadline; departments falling behind are surfaced automatically, not discovered reactively
- **Reusable verified data** — a document vault that auto-fills requirements already on file instead of asking for resubmission
- **End-to-end compliance, not just approval** — extends into renewals and expiry tracking, not a one-time checklist
- **Guided, multilingual access** — built for applicants who find government portals and legal terminology genuinely difficult, with support for regional language access (Marathi), not just English-fluent corporates

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** [Supabase](https://supabase.com/) — Postgres, Auth, Row Level Security, Realtime, and Storage
- **Icons/UI utilities:** lucide-react, clsx, tailwind-merge

## Project Structure

\```
app/            # Next.js App Router pages/routes
components/     # Shared UI components
hooks/          # React hooks
lib/            # Supabase client, utilities, shared logic
\```

## Architecture

Samanvay is built around three role-based experiences on a shared Supabase backend:

- **Applicant** — registers a project once, receives a generated approval checklist, tracks every approval's status live, manages documents in a shared vault, and responds to department queries
- **Officer** — a department-scoped queue of applications awaiting action, with tools to review, approve, reject, request more information, or schedule a (potentially joint) site visit
- **Admin** — real-time visibility into departmental workload, automatic alerts when approvals breach their service-level deadlines, and oversight across the whole system

Access control, approval generation, SLA enforcement, and phase-dependency rules (e.g. a later approval can't be granted before its prerequisite phase clears) are enforced at the database level via Postgres Row Level Security policies and triggers — not just in the frontend — so the rules hold regardless of which client calls the API.

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (URL + anon key)

### Setup

\```bash
git clone https://github.com/Miners03/samanvay-sih.git
cd samanvay-sih
npm install
\```

Create a `.env.local` file in the project root:

\```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\```

Run the development server:

\```bash
npm run dev
\```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run linting |

## Team

**CaffeineCommits** — Smart India Hackathon 2026

---

*Built to simplify and accelerate the end-to-end industrial approval journey, while preserving the statutory safeguards it depends on.*
