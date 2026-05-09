# Tasks: User Authentication System

**Input**: Design documents from `/specs/001-user-auth-system/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md  
**Feature Branch**: `001-add-jwt-auth` | **Date**: 2026-05-09

**Tests**: REQUIRED. All feature tasks include unit and integration tests following the testing pyramid with ≥80% line coverage for business logic (src/services/*, src/models/*).

**Organization**: Tasks are grouped by user story (US1 P1, US2 P2, US3 P3) to enable independent implementation and testing of each story in parallel or sequential order.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for TypeScript/Express development

- [ ] T001 Create project directory structure per plan.md (src/, tests/, db/, .specify/) in repository root
- [ ] T002 [P] Initialize Node.js project with package.json dependencies: express, typescript, jest, ts-jest, pg, jsonwebtoken, bcrypt, nodemailer, cors, dotenv
- [ ] T003 [P] Configure TypeScript with strict: true in tsconfig.json (no any types except documented exceptions)
- [ ] T004 [P] Configure ESLint and Prettier for code formatting and linting
- [ ] T005 [P] Configure Jest 29+ with ts-jest in jest.config.js and set coverage threshold to 80% for src/services/*, src/models/*
- [ ] T006 [P] Create npm scripts: test:unit, test:integration, test:coverage, dev, build, type-check, lint, format
- [ ] T007 [P] Setup GitHub Actions CI pipeline to enforce TypeScript strict mode, linting, and 80% coverage gate
- [ ] T008 [P] Create .env.example with template variables (DB_URL, JWT_SECRET, BCRYPT_ROUNDS, EMAIL_PROVIDER, etc.)
- [ ] T009 Create src/lib/config.ts to load and validate environment configuration at startup
- [ ] T010 Create src/lib/logger.ts with structured logging and correlation ID support for audit trail

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete

- [ ] T011 [P] Create database migration framework (Flyway or Knex) setup in db/migrations/ directory
- [ ] T012 [P] Create src/lib/db.ts with PostgreSQL connection pool initialization and health check
- [ ] T013 [P] Create database migration 001-create-users.sql (users table schema per data-model.md) in db/migrations/
- [ ] T014 [P] Create database migration 002-create-sessions.sql (sessions table with jti, revocation support per data-model.md) in db/migrations/
- [ ] T015 [P] Create database migration 003-create-reset-requests.sql (reset_requests table with 15-min expiry per data-model.md) in db/migrations/
- [ ] T016 [P] Create database migration 004-create-auth-events.sql (auth_events table with correlation IDs per data-model.md) in db/migrations/
- [ ] T017 [P] Create CryptoService in src/services/CryptoService.ts with password hashing (bcrypt ≥10 rounds), JWT signing/verification, token hash generation; include JSDoc for all methods
- [ ] T018 [P] Create EmailService in src/services/EmailService.ts with nodemailer integration, retry queue (up to 3 attempts), generic success responses; include JSDoc
- [ ] T019 [P] Create src/middleware/errorHandler.ts to format all error responses (non-sensitive, include correlation_id, error code, message, status)
- [ ] T020 [P] Create src/lib/types.ts with TypeScript interfaces for User, Session, ResetRequest, AuthEvent, and API request/response types
- [ ] T021 Create src/app.ts with Express app initialization, middleware registration (cors, json, error handler), route mounting
- [ ] T022 Create src/server.ts with server bootstrap (app listen on API_PORT, database connection)
- [ ] T023 [P] Create test fixtures in tests/fixtures/users.ts and tests/fixtures/db.ts for test data factories and database setup/teardown

**Checkpoint**: Foundation complete - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Account Registration and Sign-In (Priority: P1) 🎯 MVP

**Goal**: Users can create new accounts with email/password and sign in to receive authenticated sessions for protected feature access.

**Functional Coverage**: FR-001, FR-002, FR-002a, FR-003, FR-004, FR-004a, FR-005, FR-006, FR-006a, FR-011, FR-012, FR-012a

**Independent Test**: Can be fully tested by:
1. Registering a new account with valid email/password
2. Attempting registration with duplicate email (must fail)
3. Signing in with correct credentials (receives JWT)
4. Attempting sign-in with wrong password (locked out after 5 failures)
5. Verifying protected resource access with JWT
6. Verifying protected resource denial with invalid JWT

### Tests for User Story 1 (REQUIRED) ✅

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

- [ ] T024 [P] [US1] Create unit tests for password validation in tests/unit/PasswordValidation.test.ts (12+ chars, upper/lowercase/number/symbol)
- [ ] T025 [P] [US1] Create unit tests for progressive lockout logic in tests/unit/ProgressiveLockout.test.ts (5 failures → 15-min lock, escalation)
- [ ] T026 [P] [US1] Create unit tests for JWT issuance and validation in tests/unit/CryptoService.test.ts (HS256 signing, token structure, expiry checks)
- [ ] T027 [P] [US1] Create unit tests for session record creation and lookup in tests/unit/SessionManager.test.ts (jti uniqueness, expiry, revocation checks)
- [ ] T028 [US1] Create integration test for user registration flow in tests/integration/auth.flows.test.ts (valid registration, duplicate prevention, email validation)
- [ ] T029 [US1] Create integration test for user login flow in tests/integration/auth.flows.test.ts (correct credentials, wrong credentials, progressive lockout, JWT issuance)
- [ ] T030 [US1] Create integration test for protected resource access in tests/integration/auth.flows.test.ts (valid JWT grant, expired JWT denial, missing JWT denial)
- [ ] T031 [US1] Verify unit and integration tests achieve ≥80% line coverage for src/services/AuthService.ts, src/services/CryptoService.ts, src/services/SessionManager.ts via npm run test:coverage

### Implementation for User Story 1

- [ ] T032 [P] [US1] Create User model in src/models/User.ts with properties (id, email, password_hash, status, lockout_until, failed_login_attempts, password_changed_at, created_at, updated_at) and JSDoc
- [ ] T033 [P] [US1] Create Session model in src/models/Session.ts with properties (id, user_id, jti, token_hash, issued_at, expires_at, revoked_at, ip_address, user_agent) and JSDoc
- [ ] T034 [US1] Create AuthService in src/services/AuthService.ts with methods: registerUser(), loginUser(), logoutUser(), validateCredentials(), enforceProgressiveLockout(); include JSDoc with error contracts
- [ ] T035 [US1] Create SessionManager in src/services/SessionManager.ts with methods: issueSession(), validateSession(), revokeSession(), checkRevocation(); include JSDoc with type signatures
- [ ] T036 [P] [US1] Create POST /auth/register endpoint in src/routes/auth.ts with input validation (email format, password policy), duplicate email check, password hashing, user creation (per contracts/auth-api.openapi.yaml)
- [ ] T037 [P] [US1] Create POST /auth/login endpoint in src/routes/auth.ts with email/password validation, progressive lockout enforcement, session issuance, JWT response (per contracts/auth-api.openapi.yaml)
- [ ] T038 [P] [US1] Create POST /auth/logout endpoint in src/routes/auth.ts with BearerAuth requirement, session revocation (per contracts/auth-api.openapi.yaml)
- [ ] T039 [US1] Create src/middleware/authenticate.ts with JWT validation, session revocation check per-request, and correlation ID propagation
- [ ] T040 [P] [US1] Add registration and login success/failure event logging to AuthService (event_type: registration, login_success, login_failure, lockout_triggered) with correlation IDs in src/services/AuthService.ts
- [ ] T041 [P] [US1] Add JSDoc to all public methods in src/services/AuthService.ts, src/services/SessionManager.ts, src/services/CryptoService.ts with parameter types, return types, and error cases

**Checkpoint**: User Story 1 complete - registration, login, logout, and JWT validation fully functional and independently testable

---

## Phase 4: User Story 2 - Password Reset via Email (Priority: P2)

**Goal**: Users who forgot their password can request a reset link via email, validate the link, and set a new password without manual support intervention.

**Functional Coverage**: FR-007, FR-007a, FR-007b, FR-008, FR-009, FR-012, FR-012a

**Independent Test**: Can be tested by:
1. Requesting password reset for existing email (generic success response)
2. Receiving reset email with valid token
3. Using expired reset token (must fail)
4. Using already-consumed reset token (must fail)
5. Using valid token with new compliant password (success)
6. Verifying old credentials no longer work
7. Verifying all user sessions revoked after password reset
8. Requesting reset for non-existent email (generic success, no email sent)

### Tests for User Story 2 (REQUIRED) ✅

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

- [ ] T042 [P] [US2] Create unit tests for reset token generation and validation in tests/unit/PasswordResetService.test.ts (15-min expiry, single-use enforcement, token hash)
- [ ] T043 [P] [US2] Create unit tests for email retry logic in tests/unit/EmailService.test.ts (up to 3 retries, backoff strategy, generic success response)
- [ ] T044 [P] [US2] Create unit tests for password policy validation in tests/unit/PasswordValidation.test.ts (duplicate scenarios for reset flow)
- [ ] T045 [US2] Create integration test for password reset request flow in tests/integration/password-reset.test.ts (valid email, non-existent email, generic response, email queueing)
- [ ] T046 [US2] Create integration test for password reset completion flow in tests/integration/password-reset.test.ts (valid token, expired token, consumed token, new password set, sessions revoked, old credentials fail)
- [ ] T047 [US2] Create integration test for email retry scenarios in tests/integration/password-reset.test.ts (delivery failure, retry backoff, max retries exhausted)
- [ ] T048 [US2] Verify unit and integration tests achieve ≥80% line coverage for src/services/PasswordResetService.ts, src/services/EmailService.ts via npm run test:coverage

### Implementation for User Story 2

- [ ] T049 [P] [US2] Create ResetRequest model in src/models/ResetRequest.ts with properties (id, user_id, reset_token_hash, issued_at, expires_at, used_at, redeemed_by_user_id) and JSDoc
- [ ] T050 [US2] Create PasswordResetService in src/services/PasswordResetService.ts with methods: requestReset(), validateResetToken(), completeReset(), cleanupExpiredTokens(); include JSDoc with error contracts
- [ ] T051 [P] [US2] Create POST /auth/request-reset endpoint in src/routes/auth.ts with email input, user lookup (no account enumeration), generic success response, email queueing (per contracts/auth-api.openapi.yaml)
- [ ] T052 [P] [US2] Create POST /auth/reset-password endpoint in src/routes/auth.ts with reset token validation, new password validation, password update, session revocation, JWT invalidation (per contracts/auth-api.openapi.yaml)
- [ ] T053 [US2] Update AuthService.loginUser() to reject login if password_changed_at > session.issued_at (FR-009: invalidate prior credentials after reset)
- [ ] T054 [P] [US2] Update EmailService.sendResetEmail() in src/services/EmailService.ts with retry queue logic (up to 3 attempts), backoff strategy, failure logging per FR-007b, FR-012a
- [ ] T055 [P] [US2] Add password reset event logging to PasswordResetService (event_type: reset_request, reset_completed, reset_email_failed) with correlation IDs in src/services/PasswordResetService.ts
- [ ] T056 [P] [US2] Add JSDoc to all public methods in src/services/PasswordResetService.ts, src/services/EmailService.ts with parameter types, return types, error cases

**Checkpoint**: User Stories 1 AND 2 complete - account creation, authentication, and password recovery fully functional

---

## Phase 5: User Story 3 - Session Lifetime Management (Priority: P3)

**Goal**: Authenticated sessions are bound to a 24-hour validity window from issuance and automatically expire thereafter, with explicit revocation support for logout and password reset.

**Functional Coverage**: FR-010, FR-010a, FR-006a, FR-009, FR-012

**Independent Test**: Can be tested by:
1. Issuing session token at sign-in (expires_at = NOW() + 24h)
2. Accessing protected resource within 24 hours (allowed)
3. Simulating time skip beyond 24 hours (access denied)
4. Verifying per-request revocation check (session.revoked_at checked on each authenticated request)
5. Logging out and verifying token still fails post-revocation
6. Password reset invalidating all user sessions
7. Concurrent login/logout/reset scenarios

### Tests for User Story 3 (REQUIRED) ✅

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

- [ ] T057 [P] [US3] Create unit tests for session expiry enforcement in tests/unit/SessionManager.test.ts (24-hour boundary, clock skew handling, expiry_at validation)
- [ ] T058 [P] [US3] Create unit tests for per-request session revocation checks in tests/unit/SessionManager.test.ts (revoked_at = null vs timestamp scenarios)
- [ ] T059 [P] [US3] Create unit tests for concurrent session scenarios in tests/unit/SessionManager.test.ts (multiple sessions per user, independent revocation, cascade revocation on password reset)
- [ ] T060 [US3] Create integration test for session expiry in tests/integration/session.edge-cases.test.ts (issue token, verify access, skip time, verify access denied, re-login succeeds)
- [ ] T061 [US3] Create integration test for session revocation (logout, password reset) in tests/integration/session.edge-cases.test.ts (revoke session, verify access denied, verify no cross-device revocation)
- [ ] T062 [US3] Create integration test for concurrent session scenarios in tests/integration/session.edge-cases.test.ts (multiple devices login, logout one device, other devices unaffected; password reset revokes all)
- [ ] T063 [US3] Verify unit and integration tests achieve ≥80% line coverage for src/services/SessionManager.ts, src/middleware/authenticate.ts via npm run test:coverage

### Implementation for User Story 3

- [ ] T064 [P] [US3] Update SessionManager.issueSession() in src/services/SessionManager.ts to set expires_at = NOW() + 24 hours per FR-010
- [ ] T065 [P] [US3] Update SessionManager.validateSession() in src/services/SessionManager.ts to check: (NOW() < session.expires_at) AND (session.revoked_at IS NULL) per FR-010a
- [ ] T066 [P] [US3] Update src/middleware/authenticate.ts to invoke SessionManager.validateSession() on every protected request (per-request revocation check per FR-010a)
- [ ] T067 [US3] Update AuthService.logoutUser() in src/services/AuthService.ts to revoke current session (set revoked_at = NOW()) per FR-010a
- [ ] T068 [US3] Update PasswordResetService.completeReset() in src/services/PasswordResetService.ts to cascade revoke ALL user sessions (set revoked_at = NOW() for all sessions where user_id = ? per FR-009)
- [ ] T069 [P] [US3] Add session expiry and revocation event logging (event_type: session_revoked) to SessionManager.revokeSession() in src/services/SessionManager.ts with correlation IDs
- [ ] T070 [P] [US3] Add JSDoc to all updated methods in src/services/SessionManager.ts, src/middleware/authenticate.ts with 24-hour boundary and revocation semantics documented

**Checkpoint**: All user stories 1, 2, and 3 complete - full authentication system with registration, login, password reset, and session lifecycle management operational

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements, documentation, and validation across all user stories

- [ ] T071 [P] Run all tests and verify ≥80% coverage via npm run test:coverage (report should show coverage for src/services/*, src/models/*)
- [ ] T072 [P] Run TypeScript type-check via npm run type-check to verify strict: true compliance across all code
- [ ] T073 [P] Run linting via npm run lint to verify code quality and eslint rules
- [ ] T074 [P] Run full test suite via npm run test:unit && npm run test:integration to ensure all 60+ test cases pass
- [ ] T075 [P] Add integration tests for error scenarios not yet covered: database connection failure, email provider unavailable, concurrent registration race conditions in tests/integration/
- [ ] T076 [P] Create docs/API.md with curl examples for all 5 endpoints (register, login, logout, request-reset, reset-password) with sample payloads and responses
- [ ] T077 [P] Create docs/SECURITY.md documenting password policy, bcrypt rounds, JWT algorithm, session revocation, progressive lockout, email retry logic
- [ ] T078 [P] Create docs/TESTING.md documenting test structure (unit vs integration), coverage targets, and how to run test suite locally
- [ ] T079 Create docs/ARCHITECTURE.md documenting module boundaries (models, services, middleware, routes, lib) and data flow for authentication requests
- [ ] T080 Validate quickstart.md instructions by running full setup sequence locally (clone, npm install, .env setup, migrate:up, npm run dev, curl register/login)
- [ ] T081 [P] Update CHANGELOG.md with feature summary: JWT authentication, password reset, session management, 24-hour expiry, progressive lockout
- [ ] T082 [P] Run GitHub Actions CI pipeline to validate TypeScript strict, linting, coverage gate (≥80%), and all tests passing
- [ ] T083 Create PR description documenting: feature scope (US1/US2/US3), constitution compliance checklist, testing pyramid (40 unit + 20 integration), 80% coverage proof, JSDoc completeness
- [ ] T084 Peer review gate: Ensure 2+ approvals with focus on: TypeScript strictness, testing pyramid coverage, JSDoc completeness, error handling, SQL injection prevention in db layer, JWT secret management in config

**Checkpoint**: Feature complete, tested, documented, and ready for release

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends On | Status |
|-------|-----------|--------|
| Setup (Phase 1) | None | Can start immediately |
| Foundational (Phase 2) | Phase 1 complete | BLOCKS all user stories |
| US1 (Phase 3) | Phase 2 complete | Can start after foundation |
| US2 (Phase 4) | Phase 2 complete (US1 optional but recommended) | Can start in parallel with US1 |
| US3 (Phase 5) | Phase 2 complete (US1 recommended) | Can start in parallel with US1/US2 |
| Polish (Phase 6) | US1, US2, US3 complete | Final validation and documentation |

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories; foundational work unlocks this
  - Can be implemented in full isolation
  - Provides base for US2/US3 but not required for their implementation
- **User Story 2 (P2)**: No hard dependency on US1; can be developed in parallel
  - Optional: Integration with US1 for post-reset login flow
  - Should be independently testable without US1
- **User Story 3 (P3)**: Depends on US1 (session tokens must exist)
  - Requires US1 for JWT issuance; recommend US1 complete first
  - Should be independently testable for session lifecycle only

### Within Each User Story

1. **Tests FIRST**: Write and ensure FAIL before implementation (TDD)
2. **Models**: Create entities before services
3. **Services**: Implement business logic before endpoints
4. **Endpoints**: Create routes using services
5. **Middleware**: Create authentication/validation layers
6. **Integration**: Wire components together and test full flows
7. **Coverage**: Verify ≥80% before story complete

### Parallel Opportunities

- **Setup Phase (T001-T010)**: All [P] tasks can run in parallel (dependencies, tooling, config)
- **Foundational Phase (T011-T023)**: 
  - Database migrations (T013-T016) can run in parallel
  - Services (T017-T018) can run in parallel
  - Middleware/lib setup (T019-T023) can run in parallel
- **User Story 1 Tests (T024-T031)**: All test tasks [P] can run in parallel (test-first)
- **User Story 1 Models (T032-T033)**: Can run in parallel
- **User Story 1 Endpoints (T036-T038)**: Can run in parallel after models/services complete
- **User Story 2**: Full US2 can run in parallel with US1 after Foundational complete
- **User Story 3**: Full US3 can run in parallel with US1/US2 after Foundational complete
- **Polish Phase (T071-T084)**: Most [P] tasks can run in parallel

### Recommended Sequential Path (Single Developer)

1. **Phase 1 (Setup)**: Complete T001-T010 (project init) — 2-3 hours
2. **Phase 2 (Foundational)**: Complete T011-T023 (database, services, middleware) — 4-5 hours
3. **Phase 3 (US1)**: Complete T024-T041 (tests first, then registration/login/logout) — 6-8 hours
4. **Phase 4 (US2)**: Complete T042-T056 (password reset flow with email) — 5-7 hours
5. **Phase 5 (US3)**: Complete T057-T070 (session expiry and revocation) — 4-5 hours
6. **Phase 6 (Polish)**: Complete T071-T084 (testing, documentation, CI validation) — 3-4 hours

**Total Estimated Time**: 24-32 hours for full feature implementation

### Recommended Parallel Path (Team of 2-3)

1. **Phase 1** (T001-T010): 1 developer — 2-3 hours
2. **Phase 2** (T011-T023): Shared by 2-3 developers (migrations, services, middleware in parallel) — 2-3 hours
3. **Phase 3-5** (US1, US2, US3): Fully parallel after Phase 2
   - Developer 1: US1 (T024-T041) — 6-8 hours
   - Developer 2: US2 (T042-T056) — 5-7 hours
   - Developer 3: US3 (T057-T070) — 4-5 hours
4. **Phase 6** (T071-T084): Shared by all developers (parallel documentation, testing, validation) — 2-3 hours

**Total Parallel Time**: 12-16 hours (2-3x faster than sequential)

---

## Implementation Strategy

### MVP Scope (Release v1.0)

**Include**: User Story 1 (P1) only
- Registration with email/password
- Login with JWT tokens
- Logout with session revocation
- Protected resource access with JWT validation
- Progressive lockout (5 failures → 15-min lock)
- Comprehensive unit and integration tests
- JSDoc documentation

**Estimated Time**: 8-10 hours (Phases 1, 2, 3)

**Success Criteria**: 
- 95% registration completion rate
- 99% login success rate
- ≥80% test coverage for src/services/*, src/models/*
- All public APIs documented with JSDoc

### Incremental Delivery (Post-MVP)

1. **Phase 2 Release (v1.1)**: Add User Story 2 (P2)
   - Password reset via email
   - Email retry logic with generic success response
   - Progressive unlock after password reset
   - ~5-7 additional hours

2. **Phase 3 Release (v1.2)**: Add User Story 3 (P3)
   - Session lifetime management (24-hour expiry)
   - Per-request revocation checks
   - Concurrent session handling
   - ~4-5 additional hours

### Constitution Compliance Checkpoints

- **After Phase 1**: Verify TypeScript strict: true configured (T003, T004)
- **After Phase 2**: Verify database layer typed and middleware set up (T017-T020)
- **After Phase 3 (US1)**: Verify ≥80% coverage and all public APIs documented (T031, T041)
- **After Phase 4 (US2)**: Verify coverage maintained, JSDoc updated (T048, T056)
- **After Phase 5 (US3)**: Verify coverage maintained, complex logic documented (T063, T070)
- **After Phase 6 (Polish)**: Verify CI/CD gate passes, peer review approved (T082-T084)

---

## Testing Strategy

### Unit Tests (~40 test cases, 85%+ expected coverage)

Target: src/services/* and src/models/* business logic

- **CryptoService.test.ts** (~8 cases): password hashing, JWT signing/verification, token structure, edge cases
- **PasswordResetService.test.ts** (~8 cases): token generation, expiry validation, single-use enforcement, cascading revocation
- **SessionManager.test.ts** (~10 cases): issuance, validation, revocation, 24-hour expiry, concurrent sessions
- **AuthService.test.ts** (~8 cases): registration validation, login flow, progressive lockout, credential invalidation
- **PasswordValidation.test.ts** (~4 cases): policy enforcement (12+, upper/lower/num/symbol)
- **ProgressiveLockout.test.ts** (~4 cases): lockout escalation, time-based unlock

### Integration Tests (~20 test cases, 15%+ coverage)

Target: Full user journeys and cross-system interactions

- **auth.flows.test.ts** (~10 cases):
  - Happy path: register → login → protected access → logout
  - Error paths: duplicate email, wrong password, invalid JWT, expired JWT
  - Progressive lockout: 5 failures → lock, wait, unlock
  
- **password-reset.test.ts** (~6 cases):
  - Happy path: request-reset → email sent → click link → reset password → re-login succeeds
  - Error paths: expired token, already-used token, invalid new password
  - Side effects: old credentials fail, all sessions revoked
  
- **session.edge-cases.test.ts** (~4 cases):
  - Multiple sessions per user (multi-device)
  - Logout one device doesn't affect others
  - Password reset revokes all sessions for a user
  - Concurrent registration/login race conditions

### E2E Tests (Deferred to acceptance validation)

- Manual testing via quickstart.md setup and curl examples
- Postman collection for QA team
- Post-deployment smoke tests

---

## Success Criteria & Verification

### Feature Completion

- [ ] All 84 tasks completed and verified
- [ ] Constitution compliance: TypeScript strict (T003), ≥80% coverage (T031/T048/T063), JSDoc complete (T041/T056/T070)
- [ ] Testing: 40+ unit + 20+ integration test cases, all passing
- [ ] Documentation: quickstart.md, API.md, SECURITY.md, TESTING.md, ARCHITECTURE.md complete
- [ ] CI/CD gate: GitHub Actions pipeline passes (linting, type-check, coverage, tests)

### Quality Metrics

- **Code Coverage**: ≥80% line coverage for src/services/*, src/models/* (enforced by jest.config.js)
- **Type Safety**: TypeScript strict: true, no any types except documented exceptions
- **Test Pyramid**: 85%+ unit / 15%+ integration ratio maintained
- **Documentation**: 100% of public APIs and business-logic functions have JSDoc
- **Error Handling**: All errors return non-sensitive messages with correlation IDs

### Performance Targets

- **POST /auth/register**: < 100ms p95 (password hashing ~100ms)
- **POST /auth/login**: < 100ms p95 (password validation + session lookup)
- **POST /auth/logout**: < 50ms p95 (session revocation)
- **POST /auth/request-reset**: < 200ms p95 (email queueing, may include initial delivery attempt)
- **POST /auth/reset-password**: < 200ms p95 (password update + cascade revocation)
- **JWT Validation (per request)**: < 50ms p95 (session revocation check)

### Acceptance Criteria (from spec.md)

- [ ] SC-001: 95% of users successfully complete registration and first login in under 3 minutes
- [ ] SC-002: 99% of successful sign-ins result in immediate protected-resource access on first attempt
- [ ] SC-003: 95% of valid password reset attempts restore account access within 10 minutes
- [ ] SC-004: 100% of sessions are denied access after exceeding 24-hour validity window
- [ ] SC-005: 90% of auth-related support requests are resolved through self-service flows

---

## Notes

- All tasks reference exact file paths per plan.md project structure
- TypeScript strict mode is NON-NEGOTIABLE (constitutional requirement)
- 80% coverage threshold enforced by CI/CD gate (constitutional requirement)
- JSDoc mandatory for all public APIs and business logic (constitutional requirement)
- Testing pyramid required: unit tests >> integration tests > e2e tests (constitutional requirement)
- Small, reviewable PRs recommended (constitutional requirement): recommend separate PRs for Phase 1, Phase 2, US1, US2, US3, Polish
- Database migrations must be idempotent and versioned
- JWT secret must be environment variable, never hardcoded
- No plaintext passwords stored; only bcrypt hashes
- All auth events logged with correlation IDs for audit trail
