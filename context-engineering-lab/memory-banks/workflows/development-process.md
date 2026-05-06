# Development Workflow: context-engineering-lab

> **For AI assistants:** Follow this workflow when proposing, implementing, documenting, or validating changes in this project. This lab focuses on specification, context architecture, and providing templates and guidance for downstream projects like Personal Task Board. Prefer small, reviewable changes that improve clarity, consistency, or reusability across specifications.

---

## 1. Development Process

### From Idea to Merge

1. **Start from a spec or improvement opportunity**
	Identify the relevant PRD, Epic, Story, ADR, or memory bank in `specs/` or `memory-banks/` that you are creating, updating, or validating.

2. **Confirm scope and purpose**
	Verify the change aligns with the lab's mission:
	- Improves specification clarity, completeness, or reusability
	- Enhances memory bank guidance for downstream projects
	- Creates or refines templates for PRDs, Epics, Stories, or ADRs
	- Documents architectural decisions or conventions
	- Maintains consistency across all specifications and guidance

3. **Review related context**
	Load applicable files in `memory-banks/` and `specs/` before making changes:
	- `memory-banks/architecture/overview.md` — reference system designs
	- `memory-banks/conventions/coding-standards.md` — reference quality standards
	- `memory-banks/domain/glossary.md` — reference terminology and personas
	- Related PRDs, Epics, Stories for alignment

4. **Draft or refactor with clarity in mind**
	Define the smallest change that improves clarity, consistency, or completeness:
	- Add missing acceptance criteria
	- Clarify ambiguous requirements
	- Improve documentation structure
	- Update terminology to match glossary
	- Refactor a template for better reusability

5. **Self-review for quality**
	Compare the change against:
	- Existing templates and patterns
	- Project naming conventions
	- Clarity and readability
	- Consistency with related specs
	- Completeness of acceptance criteria

6. **Open pull request**
	Submit the change with a clear title, description of improvements, linked specs for context, and rationale.

7. **Complete review and merge**
	Address review feedback, confirm alignment with project goals, and merge only when approved.

### Required Inputs Before Changes

- A clear improvement goal (clarity, consistency, completeness, template quality)
- Applicable spec file(s) or memory bank context
- Understanding of how the change affects downstream projects

### Required Outputs After Changes

- Updated spec or memory bank file
- Clear commit message or PR description
- Validation that changes align with templates and conventions
- Evidence of consistency with related specs (if applicable)

---

## 2. Branching Strategy

- **Pattern**: Git flow with lighter-weight process (no CI/CD needed for documentation)
- **Branch naming**: `feature/*`, `refactor/*`, `docs/*`, `template/*`
- **Main branches**: `main`, `develop`
- **Protection rules**: `main` and `develop` require pull requests; `main` requires at least one approval

This lab uses **Git flow** adapted for specification and documentation work. There is no CI/CD required, but rigor in review ensures consistency across all specs and memory banks.

### Branch Roles

- **`main`**: Approved, finalized specs, templates, and memory banks
- **`develop`**: Working branch for new specs, refactors, and improvements
- **`feature/*`**: New spec or template development
- **`refactor/*`**: Clarity, consistency, or structure improvements to existing specs
- **`docs/*`**: Memory bank updates or documentation improvements
- **`template/*`**: New template creation or significant template refactoring

### Branch Naming Rules

- `feature/epic-1-kanban-board-spec`
- `refactor/story-template-acceptance-criteria`
- `docs/memory-bank-glossary-update`
- `template/new-adr-template`

Use lowercase kebab-case after the branch prefix. Include the story ID when the work maps directly to a Story.

### Branch Flow Requirements

1. New spec or documentation work starts from `develop`.
2. Significant updates to core specs or templates may warrant a versioned release tagged on `main`.
3. All work merges into `develop` first for team visibility and feedback.
4. Approved, stable work is cherry-picked or merged into `main` with version tags as milestones.

### Protection Rules

- Do not push directly to `main`.
- Do not push directly to `develop` without peer review (except solo emergency clarifications marked as such).
- All merges to `main` and `develop` must go through pull requests.
- `main` requires at least one approval from a team member familiar with the spec domain.

---

## 3. Pull Request Process

### Before Creating PR

- [ ] Related spec files or memory banks reviewed
- [ ] Change improves clarity, consistency, or completeness
- [ ] Naming and structure follow project conventions
- [ ] No breaking changes to existing specs without clear migration path
- [ ] Terminology aligns with `domain/glossary.md`
- [ ] Templates updated if this change affects downstream usage
- [ ] Self-review completed
- [ ] No unrelated changes bundled

### Pull Request Requirements

- **Reviewers**: Minimum 1 reviewer approval for merge to `develop`; merges to `main` require 1 approval from a domain expert
- **Description**: Concise summary, reason for change, linked specs for context, and rationale for improvements
- **Scope**: One spec update, one template refinement, or one memory bank enhancement per PR

### Pull Request Size Guidance

- Preferred size: one spec file, one template, or one memory bank section per PR
- Avoid bundling unrelated refactors with new specs
- If a template refactor is required to support a new spec cleanly, explain why it was necessary

### Spec & Documentation Review Checklist

- [ ] Change matches the intended improvement goal (clarity, consistency, completeness)
- [ ] Follows naming and structure conventions from `agents.md`
- [ ] Terminology aligns with `domain/glossary.md`
- [ ] Acceptance criteria (if applicable) are clear and measurable
- [ ] Related specs are linked or referenced
- [ ] No conflicting guidance with memory banks
- [ ] Template updates preserve reusability
- [ ] No unexplained deviations from project constraints (frontend-only, localStorage, etc.)
- [ ] Memory bank updates cross-linked where relevant
- [ ] Clarity and readability are improved

### Approval Rules

- Minimum **1 reviewer approval** for merge to `develop`
- Minimum **1 reviewer approval** for merge to `main` (preferably someone familiar with affected domain)
- Do not self-approve PRs unless working in a documented emergency (typo fixes, urgent clarifications)

---

## 4. Spec Validation & Consistency Checks

### Validation Types

- **Structural validation**
  Ensure specs follow templates and naming conventions from `specs/templates/` and `agents.md`.

- **Terminology validation**
  Verify all domain terms are aligned with `domain/glossary.md`. No conflicting definitions across specs.

- **Acceptance criteria validation**
  Ensure acceptance criteria are clear, measurable, and testable in downstream projects.

- **Consistency validation**
  Verify cross-references (PRD → Epic → Story flow), no orphaned specs, and consistent scope across related documents.

- **Downstream readiness validation**
  Ensure specs provide enough detail and guidance for a developer to implement without ambiguity.

### Validation Checklist

- [ ] Spec matches applicable template from `specs/templates/`
- [ ] Naming follows convention: `PRD-*`, `EPIC-*`, `STORY-*`, `ADR-*`, `SNAPSHOT-*`
- [ ] All terminology uses `domain/glossary.md` terms
- [ ] Acceptance criteria are clear and measurable
- [ ] Related specs are cross-linked (PRD → Epic → Stories)
- [ ] No orphaned specs (every story maps to an epic; every epic to a PRD)
- [ ] Scope aligns with project constraints (frontend-only, localStorage, no backend)
- [ ] Memory banks are referenced where applicable
- [ ] No conflicting guidance or requirements with related specs
- [ ] Enough detail for downstream implementation without ambiguity

### When to Validate Specs

- For new specs: validate before merge to `develop`
- For updates: validate impact on downstream specs (Stories from same Epic, Stories from related Epics)
- For refactors: preserve downstream consistency; update all affected specs

### Validation Tools

Manual review via the checklist above. No automated tooling required at this time.

---

## 5. Publishing & Maintenance

### Publication Model

Context-engineering-lab specs and templates are published to `main` as stable, approved guidance. There is no runtime deployment, but version tags mark significant releases of spec templates or memory bank updates.

### Versioning

- **Patch**: Typo fixes, clarifications, minor wording improvements
- **Minor**: New story templates, new memory bank sections, acceptance criteria refinements
- **Major**: New epic template, restructured memory banks, breaking changes to naming conventions

Version tags are applied to `main` after approval: `v1.0.0`, `v1.1.0`, `v2.0.0`, etc.

### Publication Process

1. Complete and approve spec or memory bank work in a PR to `develop`
2. Merge to `develop` for team visibility
3. Prepare release branch or direct PR to `main` with clear summary
4. Confirm downstream projects (like task-board) are aware of breaking changes
5. Merge to `main` with approval
6. Tag release version (if significant)
7. Update downstream project documentation if needed

### Maintenance Schedule

| Item | Frequency | Owner |
|---|---|---|
| Review specs for clarity | Quarterly | Tech Lead |
| Update glossary | Per new epic or major feature | Product Team |
| Refactor templates for reusability | Semi-annually | Architecture Team |
| Memory bank updates | Per architectural decision or process change | Tech Lead |
| Cross-project consistency check | Quarterly | Team Lead |

### Breaking Change Procedure

If a spec or template change will break downstream projects:

1. Document the breaking change in a MIGRATION.md file
2. Notify downstream project teams
3. Provide examples of how to adapt
4. Tag as `v[MAJOR].*.*` to signal breaking change
5. Keep the old version available in a `legacy/` branch if necessary

### Rollback Procedure

If a spec or template causes confusion in downstream projects:

1. Identify the problematic version tag
2. Revert the commit on `main` or keep the old tag available
3. Open a follow-up PR to clarify or refactor the guidance
4. Re-release with improved wording or structure

---

## 6. AI Assistant Operating Rules for context-engineering-lab

- Always trace spec work back to a related PRD, Epic, Story, ADR, or memory bank before editing.
- Prefer small PRs that improve one specific area (clarity, consistency, completeness, or template quality).
- Validate spec alignment with related documents before proposing merge to `main`.
- If downstream project requirements are ambiguous, improve the spec rather than inventing assumptions.
- Do not invent backend features, authentication, or cloud sync unless explicitly requested in a PRD or ADR.
- Use `domain/glossary.md` terminology consistently across all specs.
- Cross-link related specs to reduce duplication and improve discoverability.
- Ensure acceptance criteria are measurable and unambiguous for downstream implementation.

---

**Last Updated:** May 7, 2026
**Version:** 2.0
