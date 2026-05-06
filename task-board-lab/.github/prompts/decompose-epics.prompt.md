---
description: 'Decompose PRD into Epics'
mode: 'agent'
---

Read the input PRD and use `specs/templates/epic-template.md` as the required output structure for every Epic you create.

Respect the project conventions in `agents.md`.

Your task is to decompose the PRD into 3-4 high-level Epics.

Each Epic must:

1. Deliver end-to-end user value.
2. Be independently deployable as a meaningful product slice.
3. Map to at least one Success Metric from the PRD.
4. Have clear boundaries with minimal overlap with other Epics.
5. Stay consistent with the frontend-only React 18 + Vite + TypeScript + localStorage architecture unless the PRD explicitly says otherwise.

Decomposition instructions:

1. Read the PRD fully and identify the main user workflows, core capabilities, personas, scope boundaries, and success metrics.
2. Group related requirements into 3-4 Epics that represent complete workflows or clearly bounded product capabilities.
3. Avoid splitting Epics by technical layer or internal implementation tasks.
4. Name each Epic with a short kebab-case feature name for its output filename.
5. Fill out every section from `specs/templates/epic-template.md` for each Epic.
6. In the Success Criteria section, include measurable outcomes that clearly connect back to the PRD success metrics.
7. In Dependencies, list only prerequisites that truly block delivery of the Epic.
8. In User Stories, leave placeholders rather than expanding into actual stories.

Quality checklist before saving:

- Total output contains 3 or 4 Epics, not more.
- Every Epic maps to a clear persona or primary beneficiary.
- Every Epic traces to at least one PRD Success Metric.
- Every Epic can be described as a releaseable slice of user value.
- Epic boundaries are clear and non-duplicative.
- No Epic is just infrastructure, refactoring, or a technical subsystem with no standalone user outcome.

Output instructions:

1. Save each Epic as a separate file in `specs/epics/`.
2. Use filenames in this format: `EPIC-{number}-{name}.md`.
3. Number Epics sequentially starting from `EPIC-1-...`.
4. Return the list of filenames created.
5. Do not produce partial Epic drafts when complete Epic files can be generated.