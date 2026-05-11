<!--
Sync Impact Report
- Version change: 1.2.0 -> 1.3.0
- Modified principles:
	- None
- Added sections:
	- Testing Principles Sections 6-8 (Mocking & Test Data, Quality Criteria, Tools & Frameworks)
- Removed sections:
	- None (consolidated redundant CI gates and review guidance into Delivery Workflow)
- Updated sections:
	- Delivery Workflow & Quality Gates (merged review/ownership guidance)
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md
	- ✅ .specify/templates/spec-template.md
	- ✅ .specify/templates/tasks-template.md
	- ⚠ pending .specify/templates/commands/*.md (directory not present)
- Follow-up TODOs:
	- TODO(HOOK_SCRIPT_FIX): Resolve parse/encoding error in
		.specify/extensions/git/scripts/powershell/initialize-repo.ps1 (line 69)
		so mandatory pre-constitution hook can execute successfully.
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

### III. Testing by Specification and Measurable Quality Gates
Testing strategy MUST be specification-driven, test-first, and enforced by
measurable quality gates in CI. Tests MUST be written before implementation,
must not be derived from implementation internals, and MUST enforce required
coverage and mutation thresholds before merge.
Rationale: Spec-first testing reduces blind spots and provides objective
confidence for releases.

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
- Baseline frontend stack is React 18 + Vite + TypeScript + Vitest.
- Static analysis (`tsc --noEmit` strict mode and ESLint) and tests MUST run
	successfully in CI for protected branches.
- Coverage and mutation reports MUST enforce constitutional thresholds.
- JSDoc generation or lint validation SHOULD be automated where tooling allows.

## Testing Principles

### Section 1 - Testing Philosophy
- Teams MUST follow Test-Driven Development (TDD).
- Teams MUST execute the RED-GREEN-REFACTOR cycle for all business logic and
	critical UI behavior.
- Tests MUST be written FIRST before implementation code.
- Tests MUST be generated from specifications, acceptance criteria, and user
	scenarios, not from implementation details.

### Section 2 - Coverage Requirements
- The testing pyramid MUST target approximately 70% unit tests, 20%
	integration tests, and 10% end-to-end tests.
- Unit tests MUST cover services, utilities, hooks, state logic, and pure
	business rules.
- Integration tests MUST cover API endpoints, data access boundaries, and
	React feature integration flows.
- E2E tests MUST cover only critical user workflows and must not duplicate the
	full integration suite.
- Static analysis MUST pass using TypeScript strict type checking (`tsc
	--noEmit`) and ESLint.
- Minimum quality thresholds are: 80% line coverage, 75% branch coverage, and
	75% mutation score.

### Section 3 - Test Types & Organization
Test types and directory structure are mandatory and MUST follow these rules:

- Unit tests MUST live in tests/unit/**/*.test.ts or tests/unit/**/*.test.tsx
  and MUST mirror the src/ directory structure.
- Integration tests MUST live in tests/integration/**/*.test.ts or
  tests/integration/**/*.test.tsx and MUST be grouped by feature.
- E2E tests MUST live in tests/e2e/**/*.spec.ts and MUST be grouped by user
  journey.
- Unit-test organization MUST maintain one unit test file per source file.

### Section 4 - Naming Conventions
Naming conventions are mandatory and MUST follow these rules:

- Unit and integration test files MUST use the format
  ComponentName.test.ts or ComponentName.test.tsx.
- E2E test files MUST use the format user-journey-name.spec.ts.
- Test suites MUST use describe('ComponentName', ...).
- Test cases MUST use it('should do X when Y', ...).

### Section 5 - Test Anatomy
Test anatomy is mandatory and MUST follow these rules:

- The primary test structure MUST be Arrange-Act-Assert (AAA).
- Tests MUST use beforeEach for test-specific setup and MUST NOT rely on
  beforeAll for mutable setup state.
- Each test MUST be fully independent and executable in isolation.
- Tests MUST NOT depend on shared global state.

### Section 6 - Mocking & Test Data
Mocking and test data strategies are mandatory and MUST follow these rules:

- Mock MUST be used for external services: third-party APIs, email services,
  payment processors, and any out-of-process dependencies.
- Stub MUST be used for time-dependent functions (Date.now(), setTimeout,
  setInterval) and random number generators.
- Fake MUST be used for in-memory or lightweight implementations (e.g.,
  in-memory database, file system mock) in unit tests.
- Test fixtures MUST be used for complex test data; extract and reuse them
  across tests via helper functions (e.g., createTestUser(), setupMockAPI()).
- DO NOT mock code you own, internal business logic, or simple utility
  functions; test the real implementation instead.

### Section 7 - Quality Criteria
Quality criteria are mandatory and MUST follow these rules:

**What Makes a Good Test:**
- Tests MUST exercise observable behavior (user interactions, API responses,
  side effects), not internal implementation details.
- Tests MUST contain meaningful, non-tautological assertions (not
  expect(x).toBe(x) or expect(true).toBe(true)).
- Tests MUST test one thing (single responsibility); multi-concern tests MUST
  be split into focused test cases.
- Tests MUST be fast: unit tests <1 second, integration tests <5 seconds each.
- Tests MUST be deterministic: same code, same result, every run (no flakiness).

**Quality Gates:**
- Mutation score MUST be at least 75% for business-logic code using Stryker for
  TypeScript/JavaScript projects.
- Tautological tests (always-pass assertions) MUST be identified in review and
  rejected.
- All test oracles (expected values) MUST be validated by human review; do not
  copy values from implementation under test.
- Coverage MUST meet minimum thresholds: 80% line, 75% branch, 75% mutation.

**Anti-Patterns to Avoid:**
- DO NOT test private methods or internal implementation state; test via public
  APIs only.
- DO NOT create interdependent tests where execution order matters.
- DO NOT write brittle tests that break on harmless refactoring.
- DO NOT allow flaky tests (intermittent failures due to timing, randomness, or
  external state); debug and fix the root cause.
- DO NOT write tests without assertions; every test MUST verify an outcome.
- DO NOT copy-paste test logic; extract common patterns into helper functions
  and shared fixtures.

### Section 8 - Tools & Frameworks
All tooling and execution commands are mandatory and MUST follow these
specifications for this project:

**Static Analysis:**
- Type checker: TypeScript with `strict: true` mode.
- Linter: ESLint with the project config in `.eslintrc.json` or `eslint.config.js`.

**Unit & Integration Testing:**
- Framework: Vitest (latest stable version).
- Assertion library: Built-in Vitest assertions (or Chai for extended matchers).
- Mocking library: vitest.mock() for module mocks; vi.stub() for function/method stubs.

**E2E Testing:**
- Framework: Playwright (latest stable version).
- Optional: Stagehand for AI-native browser automation workflows.

**Coverage & Quality:**
- Coverage tool: c8 (integrated with Vitest) for line and branch coverage reporting.
  Minimum: 80% line coverage, 75% branch coverage.
- Mutation testing: Stryker for TypeScript/JavaScript.
  Minimum: 75% mutation score.

**Execution Commands (npm):**
- Type check: `npm run type-check` (runs `tsc --noEmit`).
- Lint: `npm run lint` (runs ESLint on src/ and tests/).
- Run all tests: `npm run test` (runs Vitest in watch mode or CI mode).
- Run unit tests: `npm run test:unit` (runs only tests/unit/).
- Run integration tests: `npm run test:integration` (runs only tests/integration/).
- Run E2E tests: `npm run test:e2e` (runs Playwright tests in tests/e2e/).
- Generate coverage: `npm run test:coverage` (runs Vitest with c8 coverage report).
- Run mutation testing: `npm run mutate` (runs Stryker mutation testing).

**Pre-Commit Hook:**
Pre-commit hooks MUST run and MUST NOT be skipped:
- Type check (`npm run type-check`)
- Linting (`npm run lint`)
- Unit tests (`npm run test:unit`)

**CI/CD Pipeline (Main Branch):**
All checks MUST pass before merging to main:
- Type check (`npm run type-check`)
- Linting (`npm run lint`)
- All tests (`npm run test`)
- Coverage report (`npm run test:coverage`) with threshold enforcement
- Mutation testing (`npm run mutate`) with 75% minimum score

## Delivery Workflow & Quality Gates

1. Plan work with explicit tasks for type safety, testing, and documentation.
2. Implement with tests aligned to the testing pyramid before final merge.
3. Validate strict type checks, lint, 70/20/10 test strategy targets,
	line/branch/mutation thresholds, and JSDoc completeness in pull request
	checks.
4. Require reviewer confirmation that constitutional principles are satisfied
	before approval.

**Code Review & Test Ownership:**
- Every feature change MUST include or update tests at the proper pyramid layer.
- Reviewers MUST reject changes that add implementation code without prior or
  concurrent spec-derived tests.
- Test code quality (readability, determinism, failure diagnostics) is a
  first-class review criterion, equal to production code quality.
- Each feature area MUST have a clear owner accountable for test health and
  recurring flake remediation.

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

**Version**: 1.3.0 | **Ratified**: 2026-05-09 | **Last Amended**: 2026-05-11
