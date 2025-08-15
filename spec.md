# AI Obituary & Eulogy Platform — Product & Technical Spec

This document translates the prompt into a structured specification and roadmap tailored to this codebase. It aligns with the stack defined in `tech.md` and existing DB schema under `src/lib/db/schema/`.

## Vision & Goals

- Build a compassionate content-generation platform to help people craft obituaries and eulogies with AI assistance.
- Provide an opinionated workflow: authenticate → create “entry” (deceased profile) → generate obituary → revise via chat → finalize → share or export.
- Ensure drafts can be saved, resumed, and deleted at any time.

## Key Personas

- **Bereaved User**: Non-technical person needing guided flows and empathetic tone.
- **Returning User**: Has existing entries and drafts; needs quick resume, edit, and export.

## Core User Stories (Happy Path)

- **Auth & Access**
  - As a user, I can sign in/up and land on a dashboard (`/dashboard`).
- **Entry Management**
  - As a user, I can create an entry with: name, date of birth, date of death, place of birth, place of death.
  - As a user, I can view my entries list, edit an entry, or delete an entry.
- **Obituary Generation**
  - As a user, I can open an entry and launch an obituary generator form with more details (profession, accomplishments, hobbies/interests, survived by, narrative life details).
  - The app formats this info into a prompt and streams an AI-generated draft document into the UI as an artifact.
- **Revision Chat**
  - As a user, I can ask for revisions via a chat UI (e.g., “shorter intro,” “more formal tone,” “include military service”).
  - The app persists the conversation and updates the document incrementally.
- **Finalize, Share, Export**
  - As a user, I can mark a draft as final, get a shareable link (public, tokenized, read-only), and export as PDF or TXT.
  - As a user, I can save drafts and resume later.

## Information Architecture

- **Dashboard (`/dashboard`)**: Personalized overview + list of “entries”; actions to create, edit, delete, and open generator.
- **Entries**:
  - Create (`/entries/new`), Edit (`/entries/[id]/edit`), Delete (server action), View (`/entries/[id]`).
- **Artifacts (Documents)**:
  - Generate for an entry (`/entries/[id]/obituary` → creates/loads an `artifact_document` of type `obituary`).
  - Editor/Chat workspace (`/artifacts/[id]`).
  - Share view (`/share/[token]`) — public, read-only.
  - Export API (`/api/artifacts/[id]/export?format=pdf|txt`).

## Data Model (aligns with existing Drizzle schema)

- `entries` (see `src/lib/db/schema/entries.ts`)
  - `id`, `userId`, `name`, `dateOfBirth`, `dateOfDeath`, `placeOfBirth`, `placeOfDeath`, timestamps, `deletedAt`.
- `artifact_document` (see `src/lib/db/schema/artifacts.ts`)
  - `id`, `userId`, `entryId`, `docType` (enum: `obituary`, `eulogy`), `title`, `content`, timestamps, `isPublic`, `shareToken`, `deletedAt`.
  - Unique on `(userId, entryId, docType)` ensures one doc per entry+type.
- `artifact_message`
  - `id`, `artifactId`, `role` (enum: `user`, `assistant`), `content`, `createdAt`.
- `artifact_version` (new)
  - Immutable snapshots for each revision to support history and diffs; relates to `artifact_document`.

Schema change: introduce `artifact_version` for revision history; otherwise use existing tables directly. This can be added in Phase 2.5.

## Tech Stack Alignment (from `tech.md`)

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript 5.9.
- **Styling**: Tailwind CSS v4, Shadcn-style UI (Radix primitives already present), `class-variance-authority`.
- **Auth**: better-auth (already wired), server actions.
- **DB/ORM**: Drizzle ORM with Neon serverless driver.
- **AI**: Vercel AI SDK (`@ai-sdk/provider`, `@ai-sdk/rsc`) with OpenAI/Anthropic adapters.
- **Validation**: Zod.
- **Build**: Turbopack, React Compiler.
- **Scripts/Runtime**: Bun for dev/tooling.

## Vercel Chat SDK “Artifacts” Integration

Integrate the Chat SDK’s artifact pattern so obituary drafts are created/updated via AI tool-calls and remain editable with linear history and diffs.

- Architecture
  - Registry: `src/lib/artifacts/server.ts` exports `documentHandlersByArtifactKind` and `artifactKinds`.
  - Server handler: `src/artifacts/text/server.ts` uses `createDocumentHandler<"text">({ onCreateDocument, onUpdateDocument })` with `streamText` + `smoothStream` to stream updates.
  - Client artifact: `src/artifacts/text/client.tsx` defines a `textArtifact` renderer (default, diff modes), plus toolbar actions (copy, save, "ask AI to revise").
  - Workspace: `components/artifact.tsx` aggregates artifacts; `/artifacts/[id]` renders the artifact alongside chat.
- Tool calls (AI SDK)
  - `artifact.createDocument({ title, entryId, details })` → creates/loads `artifact_document` (type `obituary`), streams initial content, persists final content.
  - `artifact.updateDocument({ documentId, description })` → streams revision content, persists as a new `artifact_version`, and updates latest `artifact_document.content`.
  - Ownership checks for `userId`; stream deltas via `dataStream.writeData({ type: "content-update", content })`.
- Persistence
  - `artifact_document` holds latest content and metadata.
  - `artifact_version` stores immutable snapshots (one row per revision).
  - `artifact_message` persists chat turns for conversational context.
- Generation flow
  - `/entries/[id]/obituary` form composes a structured prompt from entry fields and details.
  - Calls `artifact.createDocument`, then navigates to `/artifacts/[artifactId]` for ongoing revisions via chat.
- Diff view
  - Client computes diffs between adjacent versions and renders a “diff” mode.

## Pages, Routes, and Components

- `/dashboard` (Server Component)
  - Lists user’s entries with actions: Create, Edit, Delete, Open Generator.
  - Server actions for entry CRUD.
- `/entries/new` (Server Component + Client form where needed)
  - Form for entry fields; submit via server action with Zod validation.
- `/entries/[id]/edit`
  - Same fields as create; server action to update.
- `/entries/[id]/obituary`
  - Obituary generator form for additional details.
  - Server action triggers AI generation and creates/updates `artifact_document`.
  - Streams initial draft content to UI.
- `/artifacts/[id]`
  - Editor + Chat UI.
  - Chat messages persisted to `artifact_message`.
  - Server actions to append messages and update `artifact_document.content`.
- `/share/[token]` (Public, read-only)
  - Fetch by token, render content with print-friendly layout.
- `/api/artifacts/[id]/export` (Route Handler)
  - `GET` returns PDF or TXT based on `format` query.

## Auth & Access Control

- Gate all private routes with server checks (e.g., `auth.api.getSession({ headers: await headers() })`).
- Server actions always verify `session.user.id` matches target record’s `userId`.
- Share links use `shareToken` and `isPublic` to allow read-only access without auth.

## Server Actions (high level)

- `entriesCreateAction(form) → { id }`
- `entriesUpdateAction(id, form) → { ok }`
- `entriesDeleteAction(id) → { ok }`
- `generateObituaryAction(entryId, form) → { artifactId }` (creates/loads `artifact_document`, streams content)
- `artifactAppendChatAction(artifactId, message) → { ok }`
- `artifactSaveContentAction(artifactId, content) → { ok }`
- `artifactToggleShareAction(artifactId, isPublic) → { token }`

All actions: Zod-validated, use Drizzle, use `headers()` for auth cookie continuity, return structured `ActionState`.

## AI Generation & Prompting

- Use Vercel AI SDK with selected provider (OpenAI/Anthropic) via adapters from `@ai-sdk/provider`.
- Strategy:
  - Build a system prompt with tone guidelines (empathetic, respectful, concise where needed).
  - Include structured user inputs (profession, accomplishments, hobbies/interests, survived by, life details) and base `entries` data.
  - Enable streaming of the generated text to the editor.
- Revision Chat:
  - Append user instruction to conversation context; regenerate partials or apply edit deltas to `artifact_document.content`.
  - Persist both user and assistant messages to `artifact_message`.

## Editor & Chat UI

- Editor: simple content area backed by server-synced state; consider textarea/markdown first for MVP.
- Chat: traditional message list + input; submit via server action; optimistic UI optional.
- Accessibility: semantic HTML, sufficient contrast, keyboard focus rings.

## Export

- TXT: direct response of `content` as `text/plain`.
- PDF: server-rendered using a small library (e.g., `pdf-lib` or `@react-pdf/renderer`) in a route handler. MVP can defer styling.

## Validation & Errors

- Zod schemas for all forms and actions; surface errors atop forms.
- Use `sonner` toasts for non-blocking notifications.
- Friendly error copy; avoid technical jargon.

## Performance & Streaming

- Use server components by default; client components only where interaction is needed.
- Use RSC streaming for AI output.
- Cache stable queries with `react cache` where appropriate; avoid caching per-user sensitive data.

## Observability & Logging

- Log action errors to server console (already present). Consider structured logs later.
- Minimal analytics for MVP; respect privacy.

## Security & Privacy

- Enforce row-level ownership checks in actions.
- Tokenize share links; do not expose PII in tokens.
- Sanitize/escape rendered content; avoid HTML injection.

## Environment & Config

- `BASE_URL` (already used)
- `OPENAI_API_KEY` and/or `ANTHROPIC_API_KEY`
- Neon connection vars (`DATABASE_URL`) handled by existing setup.

## Acceptance Criteria (MVP)

- Users can auth and see a dashboard listing their entries.
- Users can create, edit, delete entries.
- Users can generate an obituary for an entry using a form; content streams to the page.
- Users can revise the draft via chat; conversation is persisted and reflected in the document.
- Users can share a read-only link and export as TXT; PDF export may be basic for MVP.

## Open Questions

- Should users select tone presets (formal, celebratory of life, religious/non-religious)?
- Versioning for artifacts beyond a single `content` column?
- Support images (e.g., portrait) in future export?

---

## Development Roadmap (Phased)

All commands use Bun as per project conventions.

### Phase 0 — Foundations (Auth/UI polish)

- Confirm login redirect fix and header session indicator (done).
- Add dashboard nav affordances (entries, generator).

### Phase 1 — Entries CRUD

- Pages: `/dashboard`, `/entries/new`, `/entries/[id]/edit`.
- Server actions: create, update, delete.
- Zod validation; toasts on success/failure.
- Ensure ownership checks on `userId`.

### Phase 2 — Obituary Generator

- Page: `/entries/[id]/obituary` (form for details).
- Action `generateObituaryAction` creates/loads `artifact_document` (type `obituary`) and streams content.
- Persist generated content to `artifact_document.content`.

### Phase 2.5 — Artifacts Integration (create/update tools)

- Add `src/lib/artifacts/server.ts` with `documentHandlersByArtifactKind` and `artifactKinds`.
- Implement `src/artifacts/text/server.ts` with `onCreateDocument` and `onUpdateDocument` using `streamText` + `smoothStream`.
- Implement `src/artifacts/text/client.tsx` and register in `components/artifact.tsx`.
- Define AI tool-calls: `artifact.createDocument`, `artifact.updateDocument`, with ownership checks and streaming deltas.
- DB migration: introduce `artifact_version` table; persist a new row per revision; keep latest in `artifact_document.content`.
- Wire `/entries/[id]/obituary` to call `createDocument`, then open `/artifacts/[artifactId]` for ongoing revisions.

### Phase 3 — Editor + Chat Revisions

- Page: `/artifacts/[id]` with editor and chat panel.
- Actions to append chat messages and save current content.
- Display message history from `artifact_message`.

### Phase 4 — Share & Export

- Public route: `/share/[token]` read-only view; token toggled by action.
- Export route: `/api/artifacts/[id]/export?format=txt|pdf`.
- Basic PDF implementation.

### Phase 5 — Quality & Polish

- Accessibility pass; print styles.
- Error boundaries for AI calls; graceful fallback when provider down.
- Light e2e coverage for happy paths.

---

## AI-Parseable Spec Manifest

```json
{
  "schema_version": "1.0.0",
  "generated_at": "${new Date().toISOString()}",
  "project_root": "/home/microdotmatrix/www/nextjs/ai-experiments/hybrid",
  "workflow": [
    "auth/login",
    "dashboard",
    "entries:create",
    "entries:edit",
    "entries:delete",
    "obituary:generate",
    "artifact:revise_chat",
    "artifact:finalize_share_export"
  ],
  "routes": {
    "dashboard": "/dashboard",
    "entries_new": "/entries/new",
    "entries_edit": "/entries/[id]/edit",
    "entries_obituary": "/entries/[id]/obituary",
    "artifact_workspace": "/artifacts/[id]",
    "share_public": "/share/[token]",
    "export": "/api/artifacts/[id]/export?format=pdf|txt"
  },
  "server_actions": [
    "entriesCreateAction",
    "entriesUpdateAction",
    "entriesDeleteAction",
    "generateObituaryAction",
    "artifactAppendChatAction",
    "artifactSaveContentAction",
    "artifactToggleShareAction"
  ],
  "db": {
    "tables": [
      "entries",
      "artifact_document",
      "artifact_message",
      "artifact_version"
    ],
    "doc_types": ["obituary", "eulogy"],
    "relationships": [
      "artifact_document.userId -> user.id",
      "artifact_document.entryId -> entries.id",
      "artifact_message.artifactId -> artifact_document.id",
      "artifact_version.artifactId -> artifact_document.id"
    ]
  },
  "ai": {
    "sdk": "@ai-sdk/provider + @ai-sdk/rsc",
    "providers": ["openai", "anthropic"],
    "streaming": true
  },
  "ai_tools": ["artifact.createDocument", "artifact.updateDocument"],
  "artifacts": {
    "kinds": ["text"],
    "registry": "src/lib/artifacts/server.ts",
    "client_definitions": ["src/artifacts/text/client.tsx"],
    "server_handlers": ["src/artifacts/text/server.ts"]
  },
  "auth": {
    "library": "better-auth",
    "session_fetch": "auth.api.getSession({ headers: await headers() })"
  },
  "ui": {
    "tailwind": "v4",
    "components": "Shadcn-style (Radix primitives)",
    "forms": "standard elements with server actions"
  },
  "exports": ["pdf", "txt"],
  "sharing": "tokenized public route"
}
```
