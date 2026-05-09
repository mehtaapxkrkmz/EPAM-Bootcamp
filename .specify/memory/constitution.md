<!--
Sync Impact Report
- Version change: 0.0.0-template -> 1.0.0
- Modified principles:
	- Template Principle 1 -> I. Clean Code First
	- Template Principle 2 -> II. TypeScript Strict Mode by Default
	- Template Principle 3 -> III. Testing Pyramid with 80% Business Logic Coverage
	- Template Principle 4 -> IV. Mandatory JSDoc for Public and Business Logic APIs
	- Template Principle 5 -> V. Small, Reviewable, Maintainable Changes
- Added sections:
	- Technical Standards
	- Delivery Workflow & Quality Gates
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md
	- ✅ .specify/templates/spec-template.md
	- ✅ .specify/templates/tasks-template.md
	- ⚠ pending .specify/templates/commands/*.md (directory not present)
- Follow-up TODOs:
	- None
-->

# speckit-lab Constitution

## Core Principles

### I. Clean Code First
All production code MUST prioritize readability, small focused units, explicit
names, and single-responsibility design. Duplicate logic MUST be removed or
consolidated before merge. Dead code, commented-out blocks, and unclear
abbreviations MUST NOT be committed.
Rationale: Clean code reduces defect rates, onboarding cost, and review churn.

### II. TypeScript Strict Mode by Default
TypeScript projects MUST compile with `strict: true` and MUST NOT disable core
strictness flags to bypass type safety. Any temporary exception requires a
time-boxed follow-up task in the same feature scope and explicit reviewer
approval.
Rationale: Strict typing prevents latent runtime bugs and makes refactors safer.

### III. Testing Pyramid with 80% Business Logic Coverage
Testing strategy MUST follow a pyramid shape: many unit tests, fewer
integration tests, and minimal end-to-end tests focused on critical journeys.
Business-logic code MUST maintain at least 80% line coverage and MUST be
measured in CI before merge.
Rationale: Pyramid-based suites maximize signal, speed, and maintainability.

### IV. Mandatory JSDoc for Public and Business Logic APIs
All new or changed public APIs and business-logic functions/classes MUST include
accurate JSDoc covering purpose, parameters, return values, thrown errors where
relevant, and side effects when non-obvious. Documentation MUST be updated in
the same change set as code behavior changes.
Rationale: JSDoc preserves intent and reduces misuse across contributors.

### V. Small, Reviewable, Maintainable Changes
Work MUST be delivered in small increments with clear test evidence and
traceability to requirements. Large cross-cutting rewrites MUST be split into
phased tasks unless explicitly approved as a single migration.
Rationale: Small changes improve review quality and reduce rollback risk.

## Technical Standards

- Language baseline for typed services is TypeScript with `strict: true`.
- Lint, type-check, and test commands MUST run successfully in CI for protected
	branches.
- Coverage reports MUST isolate business-logic directories and enforce the 80%
	threshold.
- JSDoc generation or lint validation SHOULD be automated where tooling allows.

## Delivery Workflow & Quality Gates

1. Plan work with explicit tasks for type safety, testing, and documentation.
2. Implement with tests aligned to the testing pyramid before final merge.
3. Validate strict type checks, coverage threshold, and JSDoc completeness in
	pull request checks.
4. Require reviewer confirmation that constitutional principles are satisfied
	before approval.

## Governance

This constitution supersedes conflicting local workflow conventions.
Amendments require: (a) a documented proposal, (b) impact assessment on
templates and active specs, and (c) approval by maintainers responsible for
engineering standards.

Versioning policy:
- MAJOR for backward-incompatible governance changes or principle removals.
- MINOR for new principles/sections or materially expanded obligations.
- PATCH for wording clarifications that do not change obligations.

Compliance review expectations:
- Every plan and pull request MUST include a constitution compliance check.
- Violations MUST be documented in a tracked exception with owner and expiry.
- Periodic audits MAY be run; unresolved violations block release readiness.

**Version**: 1.0.0 | **Ratified**: 2026-05-09 | **Last Amended**: 2026-05-09
