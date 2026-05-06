---
description: 'Break Epic into User Stories'
mode: 'agent'
---

Read the input Epic and use `specs/templates/story-template.md` as the required output structure for every User Story you create.

Respect the project conventions in `agents.md`.

Your task is to decompose the Epic into 5-7 User Stories.

Each story must:

1. Follow this exact format: `As a [persona], I want [action], so that [benefit].`
2. Deliver a small, meaningful slice of user value.
3. Be completable in 1-3 days.
4. Include 3-5 specific and testable acceptance criteria.
5. Pass the INVEST principles.
6. Stay consistent with the frontend-only React 18 + Vite + TypeScript + localStorage architecture unless the Epic explicitly says otherwise.

Story decomposition instructions:

1. Read the Epic fully and identify the primary persona, desired outcome, success criteria, dependencies, and likely workflow steps.
2. Break the Epic into 5-7 stories that together cover the Epic without unnecessary overlap.
3. Prefer vertical slices of behavior over technical subtasks.
4. Keep each story independently understandable and useful.
5. Fill out every section from `specs/templates/story-template.md` for each story.
6. Write acceptance criteria that are observable and verifiable.
7. Use Technical Notes only for brief implementation hints, constraints, or edge cases that help delivery.
8. Estimate each story in story points or days, and keep the scope aligned to a 1-3 day implementation window.
9. Create a short kebab-case feature name for each story filename.

INVEST quality checklist before saving:

- Independent: the story can be worked on with minimal coupling.
- Negotiable: the story describes an outcome, not a rigid implementation script.
- Valuable: the story provides a clear benefit to the persona or user workflow.
- Estimable: the story is concrete enough to size confidently.
- Small: the story fits into 1-3 days of work.
- Testable: the acceptance criteria make completion unambiguous.

Output instructions:

1. Save each story as a separate file in `specs/stories/`.
2. Use filenames in this format: `STORY-{epic}.{number}-{name}.md`.
3. Preserve the Epic number from the source Epic in the filename.
4. Number stories sequentially within the Epic starting at `1`.
5. Return the list of filenames created.
6. Do not output partial story drafts when complete story files can be generated.