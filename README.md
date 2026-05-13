# Flint — Recruiter communication (Phase 1)

Frontend-only recruiter workspace that lets Flint-style recruiters converse with nurse candidates via **SMS**, **email**, and **simulated phone calls**. Outbound integrations (Twilio, SMTP, VoIP) are intentionally stubbed — this milestone optimizes for **interaction design**, **workflow clarity**, and a deployable demo.

Live demo (**production**): **`https://flint-revery-trail.vercel.app`**

Alternative production aliases resolve to the same deployment: **`https://flint-kohl.vercel.app`** · **`https://flint-colinskot-revery-trail.vercel.app`**.

Inspect deployment: [Vercel — revery-trail/flint](https://vercel.com/revery-trail/flint/9KkVVuJ1CwY33bP6XZKjR42uw2Tw).

Share the repo with **`@heliobentes`** (GitHub) per the take-home instructions.

---

## Quick start

This repo uses **`pnpm`** (see [`package.json`](package.json) `packageManager` field). Enable Corepack once if your Node toolchain supports it:

```bash
corepack enable
```

Then install and run locally:

```bash
pnpm install
pnpm dev
```

Visit **`http://localhost:3000`** — you land on the **`/candidates` hub** (filterable roster). Choosing **Open workspace** dives into **`/candidates/[candidateId]`** for profile summary, mocked AI tooling, chronological activity, and the unified composer.

**Visible design specimen page:** [`/design-system`](https://flint-revery-trail.vercel.app/design-system) *(swap host for local dev)* — palette swatches, type scale, primitives, shell preview.

Production build locally:

```bash
pnpm build
pnpm start
```

> **pnpm 11 + native deps:** Lifecycle scripts for packages like **`sharp`** are allowed via [`pnpm-workspace.yaml`](pnpm-workspace.yaml) `allowBuilds`. If `pnpm install` reports new blocked builds, approve with `pnpm approve-builds <package>` (or revisit that file).

---

## Tech stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **shadcn/ui** primitives (Radix + CSS variables theme)
- **Vercel AI SDK** (`ai`, `@ai-sdk/openai`) — optional GPT path for drafts + deterministic mocks elsewhere
- **pnpm** for installs and locks ([`pnpm-lock.yaml`](pnpm-lock.yaml))

---

## Design system — Flint palette

Semantic tokens live in [`src/app/globals.css`](src/app/globals.css). Core brand literals from the brief:

| Token intent | Hex | Typical usage |
| --- | --- | --- |
| Canvas / backdrop | `#f9f1ed` | Page background `--background`, `--canvas` |
| Plum (primary UI) | `#44376d` | Primary buttons, headings, outlines (`--primary`, `--foreground` tone) |
| Sky accent | `#a7c8f9` | Avatars/highlights/interactive chrome (`--accent`) |

Supporting neutrals (`--border`, `--muted`, `--card`, `--muted-foreground`) prioritize recruiter readability against the canvas.

Rounded geometry (`rounded-2xl` family), soft borders, and assets in [`public/branding/`](public/branding/) reinforce the recruiter-facing brand cues from the Flint brief.

**Reviewers:** open **`/design-system`** on any deployment host for annotated swatches plus component specimens (buttons, badges, inputs, shell preview).

Components are predominantly shadcn-based (`button`, `card`, `tabs`, `toast`, …) with domain components under `src/components/`.

---

## AI surface area (compose + mocks)

Everything below is deliberately **frontend-only**. Never ship PHI into these mocks.

### 1 · Composer drafts — `POST /api/compose`

Tap **AI draft** in the composer (SMS/email tabs):

1. Structured JSON (`/api/compose`) when `OPENAI_API_KEY` is present.
2. Deterministic recruiter templates (**fallback**) when no key exists — demos still land.

Tone controls (**professional · friendly · urgent**) influence both GPT + fallback text.

### 2 · Recruiter copilot — `POST /api/recruiter-assist`

Above **Activity**, the **AI copilot (mock APIs)** tabs call `/api/recruiter-assist` with `{ mock: true, result: … }`:

| Capability | Purpose |
| --- | --- |
| **Recap** | Condense recent thread stats + open items |
| **Prep** | Checklist + suggested opener |
| **Guardrails** | Heuristic scans for risky claims (+ optional pasted draft) |
| **Schedule** | Mock smart windows anchored to candidate TZ |
| **Triage** | Deterministic “pursuit score” heuristic (demo-only) |
| **Notes / transcript** | Paste VOIP text or synthesize from last simulated call |

> **Architecture note:** Composing live messages stays on `/api/compose`; exploratory assists stay on `/api/recruiter-assist` until you unify backends in Phase 2.

Configure GPT locally *(optional)*:

```bash
cp .env.example .env.local
# OPENAI_API_KEY=sk-...
```

---

## Assumptions & limitations (Phase 1)

- Candidate rows + baseline messages are **synthetic nurse profiles** seeded in [`src/data/seed.ts`](src/data/seed.ts) — never real PHI.
- **SMS/email “Send” buttons** persist only to browser `localStorage` (plus seed history) — there is **no SMS gateway / SMTP**.
- Calls are UI-only (**no carrier / WebRTC**) with timeline logging for recruiter accountability narrative.
- **Email attachments**: UI stub/disabled (`UnifiedComposer`) — uploads would need signed URLs + persistence in Phase 2.
- Composer includes a **demo reset** (“Reset demo data”) for cleaner recordings.

---

## Deploying on Vercel

1. Push this repo to GitHub.
2. Import in Vercel (framework preset detects Next.js; **`pnpm`** is inferred from **`pnpm-lock.yaml`**).
3. Add env var **`OPENAI_API_KEY`** _(optional)_ for live AI drafts; optional without it thanks to fallback drafts.
4. Deploy — drop the canonical URL near the top of this README once ready.

---

## Screen recording checklist (your deliverable)

1. Outline product decisions (**Candidates hub first**, profile card + AI mocks, unified composer below activity, segmented SMS tooling, disposition logging narrative).
2. Walk **`/design-system`** (foundations/components/surfaces) then **`/candidates` → `/candidates/[id]`** → simulated send/logging.
3. Demo **AI draft** with tone shifts + clarify fallback (`OPENAI_API_KEY` omitted) vs optional GPT (**never expose secrets on camera**).
4. Walk **AI copilot tabs** emphasizing deterministic `/api/recruiter-assist` payloads.

---

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Local dev (`next dev`) |
| `pnpm build` | Production compilation |
| `pnpm start` | Serve `.next` output |
| `pnpm lint` | ESLint |

---

## Project structure highlights

```
pnpm-workspace.yaml      pnpm allowBuilds for native toolchain deps (e.g. sharp)
src/app/(app)            recruiter shell (TopBar + sidebar + routes)
src/app/design-system    public gallery showcasing tokens + primitives
src/app/api/compose      optional GPT + fallback drafts
src/app/api/recruiter-assist deterministic mocked assists
src/components/          layout, overview, timeline, composers, ai toolkit
src/context/portal-context.tsx → local persistence + seeded merge
src/data/seed.ts         mock nurses + seeded timeline slices
```

---

MIT licensed for evaluation purposes unless superseded by your agreement with Flint.
