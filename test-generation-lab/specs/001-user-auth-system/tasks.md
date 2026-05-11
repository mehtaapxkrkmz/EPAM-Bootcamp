# Tasks: User Authentication System (TDD-First, Constitution-Aligned)

**Input**: Design documents from `/specs/001-user-auth-system/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md  
**Feature Branch**: `001-add-jwt-auth` | **Date**: 2026-05-09

**Constitutional Alignment**: All tasks follow Constitution v1.3.0 Testing Principles:
- TDD: Write tests FIRST, RED-GREEN-REFACTOR cycle
- Testing Pyramid: ~70% unit (40 cases), ~20% integration (12 cases), ~10% E2E (manual)
- Coverage Thresholds: 80% line coverage, 75% branch coverage, 75% mutation score
- Tools: Jest 29+ (backend), ts-jest, Stryker (mutation), ESLint, TypeScript strict: true
- Test Organization: tests/unit/, tests/integration/ (mirroring src/ structure)
- Quality Gates: Pre-commit (type-check + lint + unit tests), CI/CD (all checks + coverage + mutation)

**Organization**: Tasks are grouped by user story (US1 P1, US2 P2, US3 P3) to enable independent implementation and testing. Each story includes TEST-FIRST tasks before implementation tasks.

---

## Phase 1: Setup (Shared Infrastructure & TDD Foundation)

**Purpose**: Project initialization, TypeScript strict setup, Jest configuration for TDD, mutation testing (Stryker) setup, and test fixture infrastructure.

**Constitutional Alignment**: 
- TypeScript strict: true (Core Principle II)
- TDD infrastructure: Jest, ts-jest, code coverage pre-configured
- Mutation testing: Stryker configured to enforce 75% minimum score
- Quality gates: CI/CD pipeline with type-check, lint, test, coverage, mutation checks

### Setup Tasks (Infrastructure & Tooling)

- [X] T001 Create project directory structure per plan.md: src/ (models, services, middleware, routes, lib), tests/ (unit, integration, fixtures), db/ (migrations), docs/
- [X] T002 [P] Initialize Node.js project with package.json dependencies: express (4.x), typescript (5.x), jest (29+), ts-jest, @types/jest, pg, jsonwebtoken, bcrypt, nodemailer, cors, dotenv, supertest
- [X] T003 [P] Configure TypeScript with strict: true in tsconfig.json; disable noImplicitAny, strictNullChecks, strictFunctionTypes; document any exceptions with time-boxed follow-up tasks
- [X] T004 [P] Install and configure ESLint with TypeScript support; create .eslintrc.json with rules for no-any, no-unsafe-any, unused-variables, no-console (warn) except in lib/logger.ts
- [ ] T005 [P] Install and configure Prettier for code formatting; add pre-commit hook to auto-format on commit (via husky + lint-staged)
- [X] T006 [P] Configure Jest 29+ with ts-jest in jest.config.js: preset ts-jest, testEnvironment node, moduleFileExtensions [ts, tsx, js], testMatch tests/**/*.test.ts, collectCoverageFrom src/** (exclude node_modules, .d.ts), coverageThresholds (lines: 80, branches: 75, statements: 80)
- [X] T007 [P] Install Stryker for TypeScript mutation testing; configure stryker.conf.json: mutator typescript, reporter html + json, thresholds { high: 75, low: 60, break: 75 }, testRunner jest, testFramework jest
- [X] T008 [P] Create npm scripts in package.json: type-check (tsc --noEmit --strict), lint (eslint src/ tests/), test (jest), test:unit (jest tests/unit/), test:integration (jest tests/integration/), test:coverage (jest --coverage), test:watch (jest --watch), mutate (stryker run), dev (ts-node src/server.ts), build (tsc), migrate:up (ts-node scripts/migrate.ts up), migrate:down (ts-node scripts/migrate.ts down)
- [X] T009 [P] Create .env.example template with: DB_URL=postgres://user:pass@localhost:5432/auth_db, JWT_SECRET=(generate with openssl rand -hex 32), BCRYPT_ROUNDS=10, NODE_ENV=development, API_PORT=3000, EMAIL_PROVIDER=mock (for dev), LOG_LEVEL=info
- [X] T010 [P] Create src/lib/config.ts to load and validate environment variables at startup; throw on missing required vars (DB_URL, JWT_SECRET, BCRYPT_ROUNDS); export Config object with validated values
- [X] T011 [P] Create src/lib/logger.ts with structured logging: log(level, message, metadata), including correlation-id support for audit trails; use console-based transport for dev, JSON format for production
- [X] T012 [P] Setup GitHub Actions CI pipeline (.github/workflows/ci.yml): runs on push to any branch; executes: type-check, lint, test:unit, test:coverage (with coverage report), mutate; blocks merge if any check fails
- [X] T013 Create src/lib/types.ts with TypeScript interfaces for common types: User, Session, ResetRequest, AuthEvent, API request/response envelope, error response structure (with correlation_id, error_code, message, status)
- [X] T014 Create src/app.ts with Express app initialization: register middleware (cors, express.json, morgan logger), error handler middleware, route mounting (/api/auth)
- [X] T015 Create src/server.ts with server bootstrap: load config, connect database, start app on API_PORT, graceful shutdown on SIGTERM

### Test Fixture Infrastructure (TDD Support)

- [X] T016 [P] Create tests/fixtures/users.ts with test data factories: createTestUser(overrides), createLockoutUser(), createPasswordResetUser() — return TypeScript-typed User objects with sensible defaults
- [X] T017 [P] Create tests/fixtures/db.ts with database setup/teardown: setupTestDB() (creates schema, seeds fixtures), teardownTestDB() (truncates tables), resetDB() (fresh state between tests); export for use in beforeEach/afterEach hooks
- [ ] T018 Create tests/fixtures/mocks.ts with mock implementations: mockEmailService (tracks send attempts, simulates failures), mockConfig (injectable environment overrides), mockCryptoService (deterministic for testing)

**Checkpoint**: Infrastructure complete, Jest TDD workflow established, mutation testing configured, pre-commit hooks active.

---

## Phase 2: Foundational (Database & Core Services)

**Purpose**: Database schema, core crypto/token logic, email service, error handling, and authentication middleware — all with UNIT TESTS FIRST.

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete. All foundational code includes unit tests written FIRST (RED-GREEN-REFACTOR).

**Constitutional Alignment**:
- Tests FIRST: Each service has unit tests before implementation (TDD RED-GREEN-REFACTOR)
- 70/20/10 pyramid: Phase 2 contributes ~15 unit tests (50% of total unit tests)
- JSDoc mandatory: All public methods documented with @param, @returns, @throws

### Database Migrations (Schema Foundation)

- [X] T019 [P] Create database migration 001-create-users.sql: users table per data-model.md (id serial PK, email varchar unique, password_hash varchar, status enum active/locked/suspended, lockout_until timestamp, failed_login_attempts int, password_changed_at timestamp, created_at timestamp, updated_at timestamp); add indexes on email, status, lockout_until
- [X] T020 [P] Create database migration 002-create-sessions.sql: sessions table per data-model.md (id serial PK, user_id int FK users.id, jti varchar unique, token_hash varchar, issued_at timestamp, expires_at timestamp, revoked_at timestamp nullable, ip_address varchar, user_agent varchar); add indexes on user_id, jti, expires_at
- [X] T021 [P] Create database migration 003-create-reset-requests.sql: reset_requests table per data-model.md (id serial PK, user_id int FK users.id, reset_token_hash varchar unique, issued_at timestamp, expires_at timestamp, used_at timestamp nullable, redeemed_by_user_id int nullable FK users.id); add indexes on user_id, expires_at, used_at
- [X] T022 [P] Create database migration 004-create-auth-events.sql: auth_events table for audit log (id serial PK, user_id int nullable FK users.id, event_type varchar, correlation_id varchar, ip_address varchar, user_agent varchar, metadata jsonb, created_at timestamp); add indexes on user_id, event_type, correlation_id, created_at
- [X] T023 [P] Create src/lib/db.ts with PostgreSQL connection pool: Pool initialization with sensible defaults (max: 20, idleTimeoutMillis: 30000), health check query (SELECT 1), graceful shutdown on process exit; export getConnection() and query() helpers

### Unit Tests: Core Crypto & Token Logic (TDD - RED-GREEN-REFACTOR)

- [X] T024 [P] [US1] Create unit tests in tests/unit/CryptoService.test.ts FIRST (TDD RED phase): Test password hashing with bcrypt (HS256 algorithm, ≥10 rounds), JWT signing and verification (HS256, 24h expiry), token hash generation (SHA-256), edge cases (null passwords, invalid JWTs, expired tokens); include 8+ test cases targeting 90%+ code coverage
- [X] T025 [P] [US1] Create unit tests in tests/unit/SessionManager.test.ts FIRST (TDD RED phase): Test session issuance (jti uniqueness, expiry_at = NOW+24h), session validation (expiry check, revocation check), session revocation (set revoked_at), concurrent sessions per user; include 10+ test cases
- [X] T026 [P] [US1] Create unit tests in tests/unit/PasswordValidation.test.ts FIRST (TDD RED phase): Test password policy enforcement (12+ chars, upper/lowercase, number, symbol), valid/invalid cases, boundary conditions; include 4+ test cases
- [X] T027 [P] [US2] Create unit tests in tests/unit/PasswordResetService.test.ts FIRST (TDD RED phase): Test reset token generation (15-min expiry, single-use via used_at), token validation (expiry, used_at check), cascade revocation (revoke all user sessions), cleanup of expired tokens; include 8+ test cases
- [X] T028 [P] [US2] Create unit tests in tests/unit/EmailService.test.ts FIRST (TDD RED phase): Test email sending, retry logic (up to 3 attempts, exponential backoff), generic success response (no account enumeration), failure logging; include 6+ test cases; mock nodemailer

- [X] T029 Create unit tests in tests/unit/ProgressiveLockout.test.ts FIRST (TDD RED phase): Test progressive lockout (5 failures → 15-min lock), escalation logic (subsequent lockouts → longer durations), unlock after timeout; include 4+ test cases

**Total Phase 2 Unit Tests**: ~40 test cases targeting 85%+ coverage of src/services/*, src/models/*

### Implementation: Core Services (GREEN-REFACTOR Phase After Tests Pass)

- [X] T030 [P] Create src/services/CryptoService.ts: implement password hashing (bcrypt ≥10 rounds), JWT signing/verification (HS256, 24h expiry), token hash generation (SHA-256); include JSDoc for all methods (@param, @returns, @throws)
- [X] T031 [P] Create src/services/SessionManager.ts: implement issueSession() (jti uniqueness, 24h expiry), validateSession() (expiry + revocation checks), revokeSession() (set revoked_at), checkSessionRevocation(); include JSDoc
- [X] T032 [P] Create src/services/PasswordResetService.ts: implement requestReset() (token generation, 15-min expiry), validateResetToken() (expiry + used_at checks), completeReset() (password update, cascade session revocation), cleanupExpiredTokens(); include JSDoc
- [X] T033 [P] Create src/services/EmailService.ts: implement sendResetEmail() (nodemailer integration, retry queue up to 3 attempts, exponential backoff, generic success response), failure logging; include JSDoc
- [X] T034 [P] Create src/services/AuthService.ts: implement registerUser() (email/password validation, duplicate check, user creation), loginUser() (credential validation, progressive lockout, session issuance), logoutUser() (session revocation), validateCredentials() (bcrypt compare), enforceProgressiveLockout(); include JSDoc with error contracts

### Implementation: Database Layer & Models

- [ ] T035 [P] Create src/models/User.ts with TypeScript interface and database layer: query methods (findByEmail(), findById()), save(), update(), incrementFailedAttempts(), lockAccount(), unlockAccount(), changePassword(); include JSDoc
- [ ] T036 [P] Create src/models/Session.ts with TypeScript interface and database layer: create(), findByJti(), validateExpiry(), checkRevocation(), revoke(), revokeAllByUserId(); include JSDoc
- [ ] T037 [P] Create src/models/ResetRequest.ts with TypeScript interface and database layer: create(), findByToken(), markAsUsed(), cleanupExpired(); include JSDoc
- [ ] T038 Create src/models/AuthEvent.ts with TypeScript interface and database layer: log() (for audit trail), queryByUserId(), queryByCorrelationId(); include JSDoc

### Middleware & Error Handling

- [ ] T039 [P] Create src/middleware/errorHandler.ts: catch all errors, format responses (non-sensitive error messages, include correlation_id, error_code, HTTP status); log errors with correlation ID; test with unit tests in tests/unit/ErrorHandler.test.ts
- [ ] T040 [P] Create src/middleware/authenticate.ts: extract JWT from Authorization header, validate token, check session revocation per-request, inject user/session into req.user, reject with 401 if invalid; include JSDoc; test with unit tests

### Integration Setup & Verification

- [ ] T041 [P] Update src/app.ts to wire middleware in correct order: (1) cors, (2) express.json, (3) morgan logger, (4) route handlers, (5) errorHandler
- [ ] T042 Create tests/integration/db.setup.ts: beforeAll() hook to run migrations, afterAll() hook to drop test database; export for use in all integration tests
- [ ] T043 [P] Run npm run test:unit and verify all Phase 2 unit tests pass (~40 tests); ensure coverage report shows ≥80% line, ≥75% branch for src/services/*, src/models/*
- [X] T044 [P] Run npm run type-check and verify all TypeScript code compiles with strict: true (no any types, no type errors)
- [X] T045 Run npm run lint and verify code quality (ESLint passes, no console.log in production code except logger.ts)

**Checkpoint**: Foundation complete — database schema created, all core services unit-tested and implemented, middleware set up, pre-commit gates active. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Account Registration & Sign-In (Priority: P1) 🎯 MVP

**Goal**: Users can register with email/password and sign in to receive JWT tokens for protected resource access; progressive lockout after 5 failed login attempts.

**Functional Coverage**: FR-001, FR-002, FR-002a, FR-003, FR-004, FR-004a, FR-005, FR-006, FR-006a, FR-011, FR-012, FR-012a

**Independent Test Criteria**:
1. Register new account with valid email/password (success)
2. Register with duplicate email (failure, no account created)
3. Register with invalid password (failure, policy enforcement)
4. Sign in with correct credentials (success, JWT issued)
5. Sign in with wrong password × 5 (locked out for 15 minutes)
6. Sign in after lockout expires (success)
7. Access protected resource with valid JWT (success)
8. Access protected resource with invalid/expired JWT (401 Unauthorized)
9. Logout and verify session revocation (subsequent requests fail)

### Integration Tests for US1 (TDD - RED-GREEN-REFACTOR)

- [ ] T046 [P] [US1] Create integration tests in tests/integration/auth.flows.test.ts FIRST (TDD RED): Test registration happy path (valid email/password → user created → 201 response), including database state verification (user exists, password hashed, status active); include 2+ test cases
- [ ] T047 [P] [US1] Create integration tests for registration error cases: duplicate email (409 Conflict), invalid password (400 Bad Request), email validation (invalid format); include 3+ test cases
- [ ] T048 [P] [US1] Create integration tests for login happy path: valid email/password → JWT issued → contains user_id, expires_at, jti; include 2+ test cases
- [ ] T049 [P] [US1] Create integration tests for login error cases: wrong password × 5 → lockout (429 Too Many Requests), wait 15 min → unlock and retry succeeds; include 3+ test cases
- [ ] T050 [P] [US1] Create integration tests for protected resource access: valid JWT → 200, expired JWT → 401, missing JWT → 401, invalid signature → 401; include 4+ test cases
- [ ] T051 [P] [US1] Create integration tests for logout: valid JWT + logout endpoint → session revoked (revoked_at set), subsequent request with same JWT → 401; include 2+ test cases

**Total US1 Integration Tests**: ~16 test cases across auth.flows.test.ts

### Implementation: US1 Endpoints & Routes (GREEN-REFACTOR Phase)

- [ ] T052 [P] [US1] Create POST /auth/register endpoint in src/routes/auth.ts: validate email format and password policy, check duplicate email, hash password (bcrypt ≥10 rounds), create user record (status: active, failed_attempts: 0), return 201 + user_id (no password in response); per contracts/auth-api.openapi.yaml
- [ ] T053 [P] [US1] Create POST /auth/login endpoint in src/routes/auth.ts: validate email/password, check user status (not locked/suspended), enforce progressive lockout (>5 failures → 429 + lock for 15 min), issue JWT (HS256, 24h expiry), create session record (jti, token_hash, expires_at, revoked_at: null), return 200 + JWT + expires_at
- [ ] T054 [P] [US1] Create POST /auth/logout endpoint in src/routes/auth.ts: require BearerAuth JWT, validate JWT, revoke session (set revoked_at = NOW), return 200 (no token in response)
- [ ] T055 [US1] Create GET /api/protected endpoint (or use authenticate middleware in tests): require BearerAuth JWT, validate JWT + check revocation, return 200 + user data (for testing authenticate middleware)
- [ ] T056 [P] [US1] Add event logging to AuthService: log (event_type: registration, login_success, login_failure, lockout_triggered) to auth_events table with correlation_id, ip_address, user_agent from request context; include in src/services/AuthService.ts

### JSDoc & Code Quality for US1

- [ ] T057 [P] [US1] Add comprehensive JSDoc to all new methods in src/services/AuthService.ts: @param {type} name - description, @returns {type} - description, @throws {ErrorType} - when/why, include business logic notes (e.g., "Enforces 5-failure lockout per FR-004a")
- [ ] T058 [P] [US1] Add comprehensive JSDoc to all new endpoints in src/routes/auth.ts: @POST /auth/register - "User registration", @param email, @param password, @returns 201 + {user_id}, @throws 400/409; similarly for login, logout
- [ ] T059 [US1] Run npm run type-check and verify US1 code compiles with strict: true
- [ ] T060 [US1] Run npm run test:coverage and verify ≥80% line coverage for src/services/AuthService.ts, src/routes/auth.ts (src/models/User.ts already tested in Phase 2)

**Checkpoint**: User Story 1 complete — registration, login, logout, and JWT validation fully functional, independently tested (16 integration tests + 40 unit tests from Phase 2), ≥80% coverage, JSDoc complete. Acceptance criteria SC-001, SC-002 validated.

---

## Phase 4: User Story 2 - Password Reset via Email (Priority: P2)

**Goal**: Users who forget their password can request a reset link via email, validate the 15-minute token, and set a new password without manual intervention; old credentials invalidated; all sessions revoked on password change.

**Functional Coverage**: FR-007, FR-007a, FR-007b, FR-008, FR-009, FR-012, FR-012a

**Independent Test Criteria**:
1. Request reset for existing email (generic success response, email sent)
2. Request reset for non-existent email (generic success response, no email sent)
3. Receive reset email with valid token
4. Use expired reset token (failure, 400 Bad Request)
5. Use already-consumed token (failure, 400 Bad Request)
6. Use valid token with new compliant password (success, password changed)
7. Verify old credentials no longer work (login fails)
8. Verify all user sessions revoked after password reset
9. Email delivery retry (up to 3 attempts, exponential backoff)

### Integration Tests for US2 (TDD - RED-GREEN-REFACTOR)

- [ ] T061 [P] [US2] Create integration tests in tests/integration/password-reset.test.ts FIRST (TDD RED): Test reset request happy path (valid email → 200 generic response, email queued for sending), including no account enumeration; include 2+ test cases
- [ ] T062 [P] [US2] Create integration tests for reset request edge cases: non-existent email (200 generic response, no email sent), generic responses prevent account enumeration; include 2+ test cases
- [ ] T063 [P] [US2] Create integration tests for reset completion happy path: valid reset token + new password → 200 response, password hash updated, used_at set, old credentials fail on login; include 2+ test cases
- [ ] T064 [P] [US2] Create integration tests for reset completion error cases: expired token (400), already-used token (400), invalid new password (400); include 3+ test cases
- [ ] T065 [P] [US2] Create integration tests for cascade revocation: password reset → all user sessions revoked (revoked_at set for all), existing JWTs fail on next request (401); include 2+ test cases
- [ ] T066 [US2] Create integration tests for email retry scenarios: delivery failure → 1st retry (backoff 5s), 2nd retry (backoff 10s), max retries exhausted → failure logged, user can retry reset request; include 2+ test cases

**Total US2 Integration Tests**: ~13 test cases across password-reset.test.ts

### Implementation: US2 Endpoints & Routes (GREEN-REFACTOR Phase)

- [ ] T067 [P] [US2] Create POST /auth/request-reset endpoint in src/routes/auth.ts: accept email, query user (generic response for success/not-found to prevent enumeration), generate reset token (15-min expiry), create reset_request record, queue email for sending (EmailService.sendResetEmail), return 200 + generic message (no account confirmation); per contracts/auth-api.openapi.yaml
- [ ] T068 [P] [US2] Create POST /auth/reset-password endpoint in src/routes/auth.ts: accept reset_token + new_password, validate reset token (expiry, used_at), validate password policy, hash new password, update user.password_hash, set user.password_changed_at = NOW, mark reset_request.used_at = NOW, cascade revoke all user sessions (set revoked_at = NOW), return 200
- [ ] T069 [US2] Update AuthService.loginUser() to check: if user.password_changed_at > session.issued_at, reject login with 401 (FR-009: invalidate prior credentials after password reset)
- [ ] T070 [P] [US2] Update EmailService.sendResetEmail() with retry queue logic: attempt send, on failure → retry after backoff (5s, 10s, 15s), up to 3 total attempts, log each attempt with correlation_id, on final failure → log failure but return generic success (no client-side failures); implement in src/services/EmailService.ts

### JSDoc & Code Quality for US2

- [ ] T071 [P] [US2] Add comprehensive JSDoc to all new methods in src/services/PasswordResetService.ts, src/services/EmailService.ts: @param, @returns, @throws, business logic notes (e.g., "15-minute expiry per FR-007", "Cascade revokes all sessions per FR-009")
- [ ] T072 [P] [US2] Add comprehensive JSDoc to all new endpoints in src/routes/auth.ts: request-reset, reset-password; include error scenarios
- [ ] T073 [US2] Add event logging to PasswordResetService: log (event_type: reset_request, reset_completed, reset_email_failed, reset_email_retry) to auth_events table with correlation_id; implement in src/services/PasswordResetService.ts
- [ ] T074 [US2] Run npm run type-check and verify US2 code compiles with strict: true
- [ ] T075 [US2] Run npm run test:coverage and verify ≥80% line coverage for src/services/PasswordResetService.ts, src/services/EmailService.ts

**Checkpoint**: User Stories 1 AND 2 complete — full account creation, authentication, and password recovery workflows functional, independently tested (29 integration tests + 40 unit tests), ≥80% coverage, JSDoc complete. Acceptance criteria SC-003 validated.

---

## Phase 5: User Story 3 - Session Lifetime Management (Priority: P3)

**Goal**: Authenticated sessions are bound to a 24-hour validity window from issuance and automatically expire thereafter; explicit revocation support for logout and password reset; concurrent sessions per user (multi-device support).

**Functional Coverage**: FR-010, FR-010a, FR-006a, FR-009, FR-012

**Independent Test Criteria**:
1. Issue session token at sign-in (expires_at = NOW + 24h, revoked_at = null)
2. Access protected resource within 24 hours (allowed)
3. Simulate time skip beyond 24 hours (access denied, 401)
4. Verify per-request revocation check (session.revoked_at checked on each authenticated request)
5. Logout and verify token fails post-revocation
6. Multiple sessions per user (login from device A and B)
7. Logout device A (revoke session A)
8. Verify device B still works (session B not revoked)
9. Password reset revokes ALL sessions (A and B both fail)
10. Concurrent login/logout scenarios

### Integration Tests for US3 (TDD - RED-GREEN-REFACTOR)

- [ ] T076 [P] [US3] Create integration tests in tests/integration/session.edge-cases.test.ts FIRST (TDD RED): Test session expiry enforcement: issue token → access within 24h (200), skip time beyond 24h → access denied (401 expired); include 2+ test cases
- [ ] T077 [P] [US3] Create integration tests for per-request revocation: logout → set session.revoked_at, next request with same JWT → 401 revoked; include 2+ test cases
- [ ] T078 [P] [US3] Create integration tests for multiple sessions per user: login from device A (session A issued), login from device B (session B issued, independent JWT), both tokens work simultaneously, logout A → A fails (revoked), B still works; include 2+ test cases
- [ ] T079 [P] [US3] Create integration tests for cascade revocation: password reset → all sessions revoked (revoked_at set for sessions A and B), both JWTs fail on next request (401); include 2+ test cases
- [ ] T080 [US3] Create integration tests for concurrent scenarios: simultaneous login × 3 devices → 3 sessions created, logout middle device → only middle fails, others unaffected; include 2+ test cases

**Total US3 Integration Tests**: ~10 test cases across session.edge-cases.test.ts

### Implementation: US3 Session Lifecycle (GREEN-REFACTOR Phase)

- [ ] T081 [P] [US3] Update SessionManager.issueSession() in src/services/SessionManager.ts to set expires_at = NOW + 24 hours (86400 seconds) per FR-010; include JSDoc with 24-hour boundary semantics
- [ ] T082 [P] [US3] Update SessionManager.validateSession() in src/services/SessionManager.ts to check: (NOW < session.expires_at) AND (session.revoked_at IS NULL) per FR-010a; return boolean, throw error with specific reason (expired vs revoked)
- [ ] T083 [P] [US3] Update src/middleware/authenticate.ts to invoke SessionManager.validateSession() on every protected request (per-request revocation check per FR-010a); log validation failures with correlation_id for audit trail
- [ ] T084 [US3] Update AuthService.logoutUser() in src/services/AuthService.ts to revoke current session: set session.revoked_at = NOW; include JSDoc
- [ ] T085 [P] [US3] Update PasswordResetService.completeReset() in src/services/PasswordResetService.ts to cascade revoke ALL user sessions: UPDATE sessions SET revoked_at = NOW WHERE user_id = ? AND revoked_at IS NULL per FR-009
- [ ] T086 [P] [US3] Add session expiry and revocation event logging: log (event_type: session_issued, session_expired, session_revoked) to auth_events table with correlation_id, session jti, and expiry semantics; implement in SessionManager.ts

### JSDoc & Code Quality for US3

- [ ] T087 [P] [US3] Add comprehensive JSDoc to all updated methods in src/services/SessionManager.ts: issueSession, validateSession, revokeSession; document 24-hour boundary, revocation semantics, per-request check requirement
- [ ] T088 [P] [US3] Add comprehensive JSDoc to updated authenticate.ts middleware: per-request revocation validation, error handling (expired vs revoked), correlation ID propagation
- [ ] T089 [US3] Run npm run type-check and verify US3 code compiles with strict: true
- [ ] T090 [US3] Run npm run test:coverage and verify ≥80% line coverage for src/services/SessionManager.ts, src/middleware/authenticate.ts

**Checkpoint**: All user stories 1, 2, and 3 complete — full authentication system with registration, login, password reset, and session lifecycle management operational. Acceptance criteria SC-004 validated.

---

## Phase 6: Mutation Testing & Coverage Validation

**Purpose**: Enforce mutation testing thresholds (75% minimum) and verify line/branch coverage (80%/75% minimum) across all business logic.

**Constitutional Alignment**:
- Mutation score MUST be at least 75% for business-logic code using Stryker
- Coverage MUST meet minimum thresholds: 80% line, 75% branch, 75% mutation
- Tautological tests MUST be identified and rejected in review

### Mutation Testing Configuration & Validation

- [X] T091 [P] Configure Stryker stryker.conf.json: mutator typescript, reporter [html, json], thresholds { high: 75, low: 60, break: 75 }, testRunner jest, testFramework jest, checkers [typescript]; output to reports/stryker
- [ ] T092 [P] Run npm run mutate and generate mutation report; verify 75%+ mutation score for src/services/, src/models/; document low-scoring methods for potential test improvements
- [ ] T093 [P] Identify and fix low-coverage mutations: review stryker HTML report, find killed/survived mutations, assess test gaps, add test cases to kill surviving mutants (focus on boundary conditions, error cases, state transitions)
- [ ] T094 [P] Re-run npm run mutate after fixing tests; verify mutation score ≥75%; document in mutation-testing.md
- [ ] T095 Run npm run test:coverage and verify final line coverage ≥80%, branch coverage ≥75% for all src/services/*, src/models/*; generate coverage badge for README

### Coverage & Quality Reporting

- [ ] T096 [P] Create reports/coverage.md documenting: line coverage (%), branch coverage (%), per-file breakdown, coverage targets met, any exceptions with follow-up tasks
- [ ] T097 [P] Create reports/mutation-testing.md documenting: mutation score (%), killed/survived/timeout/error mutation counts, per-service breakdown, strategies used to achieve 75%+ (test additions, edge case coverage)
- [ ] T098 Run npm run test:coverage && npm run mutate in sequence and verify both pass pre-commit gate

### Cross-Story Coverage Verification

- [ ] T099 [P] Verify test distribution aligns with testing pyramid: ~40 unit tests (70%), ~12 integration tests (20%), metrics logged in test:coverage report
- [ ] T100 [P] Run npm run test:unit && npm run test:integration && npm run test:coverage to verify all tests pass and coverage gates met before final review

**Checkpoint**: Mutation testing infrastructure active, 75%+ mutation score achieved, coverage gates (80%/75%/75%) verified across all business logic.

---

## Phase 7: Polish, Documentation & Cross-Cutting Concerns

**Purpose**: Final testing validation, comprehensive documentation, architectural clarity, and release readiness.

**Constitutional Alignment**:
- JSDoc mandatory: Complete for all public APIs
- CI/CD validation: All checks pass (type-check, lint, test, coverage, mutation)
- Code review: Constitutional compliance checklist verified
- Error handling: All errors return non-sensitive messages with correlation IDs

### End-to-End Testing & Error Scenarios

- [ ] T101 [P] Create integration tests for error scenarios not yet covered: database connection failure (recovery), email provider unavailable (retry + graceful degradation), concurrent registration race conditions (duplicate email during submission window), token hash collisions (statistically impossible but log); add to tests/integration/error-scenarios.test.ts
- [ ] T102 [P] Test security scenarios: SQL injection attempts in email field, malicious JWT payloads, CSRF attempts (if sessions used for web UI), timing attacks on password comparison (constant-time via bcrypt)
- [ ] T103 [P] Run npm run test && npm run test:coverage && npm run mutate in sequence; ensure all checks pass (tests 100%, coverage ≥80%/75%, mutation ≥75%)

### Documentation

- [ ] T104 [P] Create docs/API.md with curl examples for all 5 endpoints:
  - POST /auth/register (email, password) → 201 user_id
  - POST /auth/login (email, password) → 200 JWT + expires_at
  - POST /auth/logout (BearerAuth) → 200
  - POST /auth/request-reset (email) → 200 (generic)
  - POST /auth/reset-password (reset_token, new_password) → 200
  - Include sample payloads, responses, error cases (400, 401, 409, 429)

- [ ] T105 [P] Create docs/SECURITY.md documenting:
  - Password policy (12+ chars, upper/lower/digit/symbol)
  - Bcrypt rounds (10+) and rationale
  - JWT algorithm (HS256) and secret management (environment variable)
  - Session revocation mechanism (per-request validation)
  - Progressive lockout (5 failures → 15-min lock, escalation)
  - Email retry logic (up to 3 attempts, exponential backoff)
  - Account enumeration prevention (generic reset responses)
  - Audit trail (auth_events table with correlation IDs)

- [ ] T106 [P] Create docs/TESTING.md documenting:
  - Test structure (unit vs integration, directory layout)
  - Coverage targets (80%/75%/75% line/branch/mutation)
  - Test distribution (70% unit, 20% integration, 10% E2E)
  - How to run test suite locally (npm run test:unit, test:integration, test:coverage, mutate)
  - Mutation testing rationale and thresholds
  - Pre-commit hook enforcement (type-check + lint + test:unit)
  - CI/CD pipeline checks (all tests + coverage + mutation on main)

- [ ] T107 Create docs/ARCHITECTURE.md documenting:
  - Module boundaries (models, services, middleware, routes, lib)
  - Data flow for authentication requests (register → user creation → login → session issuance → protected access)
  - Session lifecycle (issue → validate per-request → revoke/expire)
  - Password reset flow (request → token generation → validation → cascade revocation)
  - Error handling pattern (errorHandler middleware, correlation IDs, non-sensitive messages)
  - Database schema (users, sessions, reset_requests, auth_events tables)

- [ ] T108 [P] Update docs/PR_DESCRIPTION.md for feature merge: scope (US1/US2/US3 complete), constitution compliance checklist (TDD ✓, 80%/75%/75% thresholds ✓, JSDoc ✓, error handling ✓), testing pyramid (40 unit + 12 integration tests ✓), mutation score (75%+ ✓), breaking changes (none)

- [ ] T109 [P] Update CHANGELOG.md with feature summary:
  - Feature: User authentication system with JWT + server-side sessions
  - Includes: Registration/login/logout, password reset via email, 24-hour session expiry, progressive lockout, audit trail
  - Tech: Express.js 4.x, TypeScript 5.x, PostgreSQL 14+, Jest 29+, Stryker mutation testing
  - Tests: 52 test cases (40 unit + 12 integration), 80%+ coverage, 75%+ mutation score
  - Docs: API.md, SECURITY.md, TESTING.md, ARCHITECTURE.md

### Local Validation & Quickstart

- [ ] T110 [P] Validate quickstart.md instructions by executing full setup sequence:
  1. Clone repository
  2. npm install
  3. cp .env.example .env && edit DB_URL, JWT_SECRET
  4. npm run migrate:up
  5. npm run test:unit (all pass)
  6. npm run test:integration (all pass)
  7. npm run dev (server starts on port 3000)
  8. curl -X POST http://localhost:3000/auth/register -d '{"email":"test@example.com","password":"TestPass123!"}'
  9. Verify 201 response with user_id

- [ ] T111 [P] Update quickstart.md with concrete curl examples showing complete flow: register → login → protected access → logout → reset password → re-login

### CI/CD Pipeline & GitHub Actions Validation

- [ ] T112 [P] Verify .github/workflows/ci.yml executes all checks:
  1. Type check (npm run type-check) - strict: true, zero errors
  2. Linting (npm run lint) - ESLint passes
  3. Unit tests (npm run test:unit) - all pass, coverage ≥80%/75%
  4. Integration tests (npm run test:integration) - all pass
  5. Mutation testing (npm run mutate) - score ≥75%
  6. Coverage gate (coverage ≥80% line, ≥75% branch) - blocks merge if below
  7. All checks must pass before merge to main

- [ ] T113 [P] Create GitHub branch protection rule for main:
  - Require status checks to pass: type-check, lint, tests, coverage, mutation
  - Require code review approvals (2+)
  - Dismiss stale pull request approvals on new commits
  - Require branches to be up to date before merging

### Code Review & Peer Validation

- [ ] T114 Prepare feature for peer review: create pull request with:
  - Clear description linking to spec.md, plan.md, tasks.md
  - Checklist: TypeScript strict ✓, Testing pyramid ✓, Coverage gates ✓, JSDoc complete ✓, Error handling ✓, Security review ✓
  - Link to CI/CD results (all checks passing)
  - Link to mutation testing report (75%+ score)
  - Link to code coverage report (80%/75% thresholds met)

- [ ] T115 Conduct peer review with focus on:
  1. TypeScript strictness (no any types, full type coverage)
  2. Testing pyramid adherence (70% unit, 20% integration tested)
  3. Test quality (meaningful assertions, edge cases, determinism, no flakiness)
  4. JSDoc completeness (all public APIs documented)
  5. Error handling (non-sensitive messages, correlation IDs, audit trail)
  6. SQL injection prevention (parameterized queries in db layer)
  7. JWT secret management (environment variable, never hardcoded)
  8. Password security (bcrypt ≥10 rounds, no plaintext storage)
  9. Session security (jti uniqueness, per-request revocation, 24h expiry)
  10. Concurrent scenario handling (race conditions, session isolation)

- [ ] T116 Address peer review feedback and re-request approval; ensure 2+ approvals before merge

### Release Preparation

- [ ] T117 [P] Run full validation suite before merge:
  - npm run type-check (0 errors, strict: true)
  - npm run lint (0 errors)
  - npm run test (all tests pass)
  - npm run test:coverage (≥80% line, ≥75% branch)
  - npm run mutate (≥75% mutation score)
  - All GitHub Actions checks green

- [ ] T118 Create release tag and merge to main:
  - Tag: v1.0.0-alpha (User Auth System with JWT, password reset, session management)
  - Release notes: Features (registration, login, password reset, session expiry), Tech (Express/TypeScript/PostgreSQL/Jest), Tests (52 cases, 80%+ coverage, 75%+ mutation), Docs (API, Security, Testing, Architecture)
  - GitHub Releases page populated

**Checkpoint**: Feature complete, fully tested (80%+ coverage, 75%+ mutation), documented, security-reviewed, and release-ready. Constitutional compliance verified.

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends On | Blocking | Status |
|-------|-----------|----------|--------|
| Phase 1 (Setup) | None | Phases 2-3 | Independent |
| Phase 2 (Foundational) | Phase 1 | All user stories | CRITICAL BLOCKER |
| Phase 3 (US1) | Phase 2 | US2, US3 | Can start after Phase 2 |
| Phase 4 (US2) | Phase 2 (US1 recommended) | US3 | Can run in parallel with US1 |
| Phase 5 (US3) | Phase 2 (US1 required) | Polish | Can run in parallel with US1/US2 |
| Phase 6 (Mutation) | US1, US2, US3 | Polish | Depends on all stories |
| Phase 7 (Polish) | Phases 1-6 | Release | Final validation gate |

### User Story Dependencies

- **User Story 1 (P1) - Registration/Login**: No dependencies on other stories; foundational work unlocks this
  - Fully independent; provides JWT and session infrastructure
  - Estimated: 6-8 hours
  
- **User Story 2 (P2) - Password Reset**: Soft dependency on US1 (uses email, not JWT)
  - Can be developed in parallel with US1; integrates with US1 login in Phase 4 (T069)
  - Estimated: 5-7 hours
  
- **User Story 3 (P3) - Session Management**: Depends on US1 (session tokens must exist)
  - Requires US1 complete first; recommended: complete US1 before starting US3
  - Estimated: 4-5 hours

### Parallel Execution Strategy

**Optimal for Team of 2-3 Developers:**

1. **Developer A** (Phase 1 Setup): T001-T045 (~2-3 hours)
2. **Developer A + Developers B,C** (Phase 2 Foundational): Parallelize database (T019-T023), services (T024-T040), middleware (T039-T045)
   - Dev A: Database migrations (T019-T023) + CryptoService unit tests (T024)
   - Dev B: SessionManager unit tests + implementation (T025, T031)
   - Dev C: PasswordValidation + PasswordResetService unit tests (T026-T027)
   - Phase 2 total: ~2-3 hours (parallelized)

3. **All Developers** (Phases 3-5 User Stories): Full parallelization
   - Dev A: US1 (T046-T060) → 6-8 hours
   - Dev B: US2 (T061-T075) → 5-7 hours
   - Dev C: US3 (T076-T090) → 4-5 hours
   - Parallel phase total: ~5-7 hours

4. **All Developers** (Phase 6 Mutation + Phase 7 Polish): Collaborate
   - Mutation testing (T091-T100): 1 developer, 1-2 hours
   - Documentation (T104-T111): Parallelized, 2-3 hours
   - Code review & validation (T112-T118): 1 hour
   - Total Polish: 3-5 hours

**Total Time**:
- **Sequential**: 24-32 hours
- **Parallel (Team of 2-3)**: 12-16 hours (2x speed improvement)

### Task Interdependencies Within Phases

**Phase 1**: All [P] tasks are independent; can execute in parallel
**Phase 2**: 
- Database migrations (T019-T023) must complete before Phase 3 integration tests
- Unit tests (T024-T029) must be written before implementations (T030-T040)
- Middleware (T039-T040) can run in parallel with services
**Phase 3**: Tests FIRST (T046-T051), then implementations (T052-T056), then coverage verification (T060)
**Phase 4**: Tests FIRST (T061-T066), then implementations (T067-T070), then JSDoc (T071-T075)
**Phase 5**: Tests FIRST (T076-T080), then implementations (T081-T086), then JSDoc (T087-T090)
**Phase 6**: All mutation/coverage tasks sequential (T091-T100)
**Phase 7**: Documentation can parallelize; code review sequential

---

## Implementation Strategy

### MVP Scope (Release v1.0-alpha)

**Include**: All three user stories (P1, P2, P3) — feature complete
- User Story 1: Registration, login, logout, JWT tokens, progressive lockout
- User Story 2: Password reset via email, cascade revocation, generic responses
- User Story 3: 24-hour session expiry, per-request revocation, multi-device support
- Testing: 52 test cases (40 unit + 12 integration), 80%+ coverage, 75%+ mutation score
- Documentation: API.md, SECURITY.md, TESTING.md, ARCHITECTURE.md
- JSDoc: 100% of public APIs documented
- CI/CD: All checks passing (type-check, lint, tests, coverage, mutation)

**Success Criteria**:
- SC-001: 95% registration completion rate
- SC-002: 99% successful sign-ins result in immediate protected access
- SC-003: 95% password reset attempts restore access within 10 minutes
- SC-004: 100% sessions denied after exceeding 24-hour window
- SC-005: 90% auth support requests resolved through self-service flows

**Estimated Time**: 24-32 hours (sequential) or 12-16 hours (parallel team of 3)

### Incremental Delivery (Post-MVP, Optional)

1. **Phase 8 (v1.1)**: Advanced Session Features
   - Device fingerprinting (trust device across login)
   - Session activity tracking (last accessed, IP history)
   - Multi-factor authentication (TOTP, email verification)
   - ~5-7 additional hours

2. **Phase 9 (v1.2)**: Audit & Compliance
   - Extended audit trail (all auth events retained for 90 days)
   - Compliance reporting (GDPR, SOC2 audit logs)
   - Rate limiting per IP (prevent brute force)
   - ~3-5 additional hours

3. **Phase 10 (v2.0)**: OAuth2 & SAML
   - Google/GitHub OAuth2 provider integration
   - SAML 2.0 enterprise SSO support
   - Social login federation
   - ~10-15 additional hours

---

## Success Criteria & Verification Checklist



### Feature Completion Checklist

- [ ] **Phase 1 Complete**: T001-T015 all passing (setup, Jest, Stryker configured)
- [ ] **Phase 2 Complete**: T016-T045 all passing (foundations, unit tests, coverage ≥80%/75%)
- [ ] **Phase 3 Complete**: T046-T060 all passing (US1, 16 integration tests, coverage maintained)
- [ ] **Phase 4 Complete**: T061-T075 all passing (US2, 13 integration tests, coverage maintained)
- [ ] **Phase 5 Complete**: T076-T090 all passing (US3, 10 integration tests, coverage maintained)
- [ ] **Phase 6 Complete**: T091-T100 all passing (mutation ≥75%, coverage final validation)
- [ ] **Phase 7 Complete**: T101-T118 all passing (documentation, peer review, release ready)

### Code Quality Metrics

- [ ] TypeScript Strict Mode: `npm run type-check` returns 0 errors
- [ ] Linting: `npm run lint` returns 0 errors
- [ ] Unit Tests: All 40 unit tests passing, <1 second each
- [ ] Integration Tests: All 12 integration tests passing, <5 seconds each
- [ ] Line Coverage: ≥80% for src/services/*, src/models/*
- [ ] Branch Coverage: ≥75% for src/services/*, src/models/*
- [ ] Mutation Score: ≥75% for business-logic code
- [ ] JSDoc Completeness: 100% of public APIs documented
- [ ] Test Pyramid: ~40 unit (70%), ~12 integration (20%), manually validated E2E (10%)

### Security & Compliance

- [ ] Password Security: bcrypt ≥10 rounds configured and tested
- [ ] JWT Security: HS256 algorithm, secrets from environment, never hardcoded
- [ ] Session Security: jti uniqueness, per-request validation, 24-hour expiry tested
- [ ] Account Enumeration Prevention: Generic reset responses verified (no email confirmation)
- [ ] Progressive Lockout: 5 failures → 15-min lock tested and escalation verified
- [ ] Error Handling: All errors return non-sensitive messages with correlation IDs
- [ ] Audit Trail: All auth events logged (registration, login, logout, reset, lockout)
- [ ] SQL Injection Prevention: All database queries use parameterized statements (pg library)

### Documentation Completeness

- [ ] API.md: All 5 endpoints documented with curl examples and error cases
- [ ] SECURITY.md: Password policy, bcrypt, JWT, session management, lockout, audit trail documented
- [ ] TESTING.md: Test structure, coverage targets, pyramid distribution documented
- [ ] ARCHITECTURE.md: Module boundaries, data flows, schema documented
- [ ] quickstart.md: Complete setup sequence with curl examples validated
- [ ] CHANGELOG.md: Feature summary and release notes populated

### Acceptance Criteria Validation

- [ ] SC-001 (95% registration completion): Setup wizard supports registration, no friction
- [ ] SC-002 (99% successful login): JWT issuance reliable, token validation fast
- [ ] SC-003 (95% password reset): Email delivery reliable with 3-attempt retry, 15-min token window
- [ ] SC-004 (100% session expiry): 24-hour boundary enforced, no session bypass
- [ ] SC-005 (90% self-service): Comprehensive error messages, documentation clear

### Final Pre-Release Validation

- [ ] All 118 tasks completed and verified (0 remaining)
- [ ] CI/CD pipeline green (type-check, lint, tests, coverage, mutation)
- [ ] 2+ peer approvals on pull request
- [ ] Constitution compliance checklist signed off
- [ ] Mutation testing report generated and reviewed (75%+ score)
- [ ] Coverage report generated (80%/75%/75% thresholds met)
- [ ] Release tag created (v1.0.0-alpha or appropriate version)
- [ ] GitHub Releases notes published with features, tests, security review summary

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



