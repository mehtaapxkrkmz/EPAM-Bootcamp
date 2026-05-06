# agents.md

## Purpose

This file defines project conventions for AI assistants working in this task board workspace. Follow these rules when creating or updating specifications and related project artifacts.

## Tech Stack

- Frontend: React 18 with Vite
- Language: TypeScript
- Persistence: localStorage only
- Backend: none

## Specification Structure

- PRDs are stored in `specs/prds/`
- Epics are stored in `specs/epics/`
- User Stories are stored in `specs/stories/`
- Architecture Decision Records (ADRs) are stored in `specs/adrs/`
- Implementation snapshots are stored in `specs/adrs/` with `SNAPSHOT-` prefix
- Reusable templates are stored in `specs/templates/`
- Reusable Copilot prompts are stored in `.github/prompts/`

## Naming Conventions

- Use Markdown files for all specs.
- Use kebab-case for descriptive names.
- Prefix files by spec type:
  - `PRD-{feature-name}.md`
  - `EPIC-{number}-{feature-name}.md`
  - `STORY-{epic-number}.{story-number}-{feature-name}.md`
  - `ADR-{number}-{decision-title}.md`
  - `SNAPSHOT-{adr-number}-{context}-{date}.md`
- Keep names short, specific, and aligned to the user-facing feature or workflow.

## File Organization

- Keep templates generic and reusable.
- Keep generated specs in their corresponding output folders only.
- Do not mix PRDs, Epics, and Stories in the same directory.
- When creating Stories, ensure they map to an existing Epic.
- When creating Epics, ensure they map back to a PRD.
- Prefer one spec per file.

## Working Guidance For AI Assistants

- Follow the templates in `specs/templates/` when generating new specs.
- Keep content concrete, measurable, and implementation-aware.
- Respect the frontend-only constraint: no backend services, APIs, or server storage.
- Assume state is stored locally in the browser via localStorage unless the user explicitly changes the architecture.