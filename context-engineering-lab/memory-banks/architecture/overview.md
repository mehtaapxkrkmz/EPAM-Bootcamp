# Architecture Overview — Personal Task Board

> **For AI assistants:** Load this file before implementing any feature. It defines the technical boundary of the system. All implementation decisions must stay within these constraints.

---

## 1. System Architecture

**Pattern:** Single-page application (SPA) monolith — no backend, no server, no network calls.

**Rationale:** The primary user need is zero-friction, offline-first task management. Any server dependency introduces latency, signup friction, and infrastructure cost that conflicts with the PRD goal of being immediately productive with no onboarding.

### Key Components

| Component | Responsibility |
|---|---|
| **App Shell** | Root React component, routing, project context provider |
| **Kanban Board** | Renders 3 fixed columns: To Do, In Progress, Done |
| **Task Modal** | Create/edit task with title and optional description |
| **Project Switcher** | Select and filter between up to 3 concurrent projects |
| **Persistence Layer** | Read/write all state to browser localStorage |
| **Keyboard Controller** | Intercepts global shortcuts; arrow-key and Enter/Delete nav |
| **Export Module** | Serializes current project tasks to downloadable JSON |

### Data Flow

```
User Interaction
     │
     ▼
React Component (state mutation)
     │
     ▼
localStorage (write-through, synchronous)
     │
     ▼
Re-render via React state
```

There is no async data pipeline, message queue, or remote call at any point.

### Constraints AI Assistants Must Respect

- No `fetch`, `axios`, or HTTP calls of any kind.
- No server-side rendering or Node.js runtime code.
- No external authentication providers or session tokens.
- All persistent state lives exclusively in `localStorage` under a consistent key schema.
- localStorage operations must complete in <50ms (kept small — task data only, no blobs).

---

## 2. Tech Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| **Language** | TypeScript | Latest stable | Type safety prevents runtime errors in localStorage serialization and keyboard event handling |
| **UI Framework** | React | 18.x | Component model fits Kanban column/task hierarchy; concurrent features available if needed |
| **Build Tool** | Vite | Latest stable | Sub-second HMR for fast local iteration; lightweight production bundle |
| **Persistence** | Browser `localStorage` | Web API | Zero infrastructure; survives page reload; same-origin isolated |
| **Drag-and-Drop** | TBD (e.g., `@dnd-kit/core`) | — | Native HTML5 DnD lacks accessibility; library handles ARIA and keyboard fallback |
| **Styling** | TBD (CSS Modules / Tailwind) | — | Must support dark mode toggle and high-contrast states per WCAG 2.1 AA |
| **Testing** | TBD (Vitest + React Testing Library) | — | Co-located with Vite; aligns with component-level acceptance criteria in Stories |

> **Note:** Items marked TBD are unresolved. Check `specs/adrs/` for any ADRs that resolve them before implementing.

### Key localStorage Schema (Conceptual)

```json
{
  "ptb:projects": [{ "id": "uuid", "name": "string", "createdAt": "ISO8601" }],
  "ptb:tasks": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "title": "string",
      "description": "string | null",
      "status": "todo | in-progress | done",
      "createdAt": "ISO8601",
      "completedAt": "ISO8601 | null"
    }
  ]
}
```

Prefix `ptb:` namespaces keys to avoid collisions with other apps sharing the same origin.

---

## 3. Deployment

**Deployment Model:** Static file hosting — build output is a folder of HTML, JS, and CSS assets with no server component.

**Rationale:** Matches the no-backend constraint. Any static host (GitHub Pages, Netlify, Vercel static, S3+CloudFront) can serve the app. No provisioning, scaling, or database migration is ever required.

### Environments

| Environment | Purpose | Notes |
|---|---|---|
| **Local (dev)** | Active development | `vite dev` with HMR; localStorage data persists per browser profile |
| **Preview** | PR validation / stakeholder review | Deploy branch build to temporary static URL (e.g., Netlify preview) |
| **Production** | Shipped application | Versioned static build deployed to hosting provider |

### CI/CD Approach

Recommended minimal pipeline (treat as target state):

1. **On push / PR:** Run `tsc --noEmit` (type check) + `vitest run` (unit tests)
2. **On PR merge to main:** `vite build` → deploy static output to production host
3. **No database migrations, no container builds, no infrastructure steps.**

### Performance Targets (from PRD)

- App loads and renders board in **<2 seconds** on 4G / modern broadband
- Task create, drag, and completion interactions respond in **<100ms**
- localStorage read/write completes in **<50ms**

---

## 4. Architectural Decisions Log

For the full rationale behind key technical choices, read the ADRs in `specs/adrs/`:

| ADR | Decision |
|---|---|
| [ADR-1](../../specs/adrs/ADR-1-react-vite-frontend.md) | React 18 + Vite as frontend stack |
| [ADR-2](../../specs/adrs/ADR-2-localstorage-persistence.md) | localStorage as sole persistence layer |
| [ADR-3](../../specs/adrs/ADR-3-keyboard-driven-navigation.md) | Keyboard-driven navigation model |
| [ADR-4](../../specs/adrs/ADR-4-indexeddb-secondary-storage.md) | IndexedDB as secondary/overflow storage |

---

**Last Updated:** May 6, 2026
**Version:** 1.0
