---
description: 'Generate a PRD from project brief'
mode: 'agent'
---

Read the PRD template at `specs/templates/prd-template.md` and use it as the required output structure.

Use the provided project brief as the only source of product context unless the user explicitly adds more requirements.

Create a complete PRD that:

1. Follows every section in the template exactly.
2. Replaces placeholders with concrete, project-specific content.
3. Uses specific and measurable details instead of generic product language.
4. Respects the project conventions in `agents.md`.
5. Assumes a frontend-only React 18 + Vite application with TypeScript and localStorage, with no backend, unless the brief explicitly states otherwise.

Generation instructions:

1. Read the project brief carefully and extract the product problem, target users, core features, constraints, and goals.
2. Create a short feature name in kebab-case for the output filename.
3. Fill in all PRD sections:
   - Overview: purpose, problem statement, and goals
   - User Personas: named personas with roles, needs, and pain points
   - Use Cases: realistic end-to-end scenarios
   - Functional Requirements: clear system behaviors
   - Non-Functional Requirements: performance, security, reliability, accessibility
   - Success Metrics: measurable outcomes
   - Scope: clear in-scope and out-of-scope boundaries
4. Make reasonable assumptions only when needed, and keep them consistent with the brief.
5. If the brief is missing critical detail, choose sensible defaults and state them clearly in the PRD rather than leaving placeholders.

Quality checklist before saving:

- Problem statement includes concrete scale, frequency, or impact numbers when available; if missing, make the problem as specific as the brief allows.
- Personas are named and differentiated.
- Success metrics are SMART: specific, measurable, achievable, relevant, and time-bound.
- Scope clearly separates what is included from what is explicitly excluded.
- Requirements are concrete enough that Epics can be derived from them later.
- Content does not introduce a backend or server-side dependency unless the brief explicitly requires it.

Output instructions:

1. Save the completed PRD to `specs/prds/PRD-{feature-name}.md`.
2. Return the final filename used.
3. Do not output an outline or partial draft when a complete PRD can be produced.