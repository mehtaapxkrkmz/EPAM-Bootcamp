# Research: User Authentication System

**Purpose**: Document research findings, clarifications, and technology decisions for implementation planning.  
**Created**: 2026-05-09

## Clarification Status

All specification clarifications resolved during `/speckit.clarify` phase:

1. ✅ **Session Architecture**: JWT with server-side session record (jti) and revocation support, 24-hour absolute expiry.
2. ✅ **Password Reset Token Validity**: 15 minutes, single-use.
3. ✅ **Failed Login Policy**: Progressive lockout (5 failures → 15-minute lock, escalating).
4. ✅ **Password Policy**: Minimum 12 characters with upper/lowercase, number, symbol.
5. ✅ **Reset Email Delivery Failures**: Generic success response, retry up to 3 times, log failures for operations.

No additional research blockers identified; all functional requirements are clear and implementable.

## Technology Decision Rationale

### JWT + Server-Side Sessions (vs Stateless Alternatives)

**Decision**: JWT tokens with server-side session records (via `jti` claim) and revocation support.

**Rationale**:
- **Immediate revocation on password reset** (FR-009): Stateless tokens cannot be revoked instantly; adding sessions enables per-request revocation checks.
- **Lockout enforcement** (FR-004a): Revocation ensures locked-out accounts cannot use old tokens after lockout duration expires.
- **Security hardening**: Stateless tokens exposed to token replay risk if compromise occurs; session records add defense-in-depth.

**Trade-off**: Session store adds modest latency (~50ms p95 per request for PostgreSQL query) vs stateless (zero lookup). Acceptable for security requirements.

### bcrypt for Password Hashing

**Decision**: bcrypt with salt rounds ≥10.

**Rationale**:
- **Industry standard** for user credential storage; resistant to rainbow tables.
- **Work factor tuning**: Salt rounds config allows performance/security trade-off; 10 rounds ~100ms, acceptable for non-batched registration/reset flows.
- **Stable**: Well-tested, no recent vulnerabilities; available in Node.js ecosystem (bcrypt package).

### PostgreSQL for Session Persistence

**Decision**: PostgreSQL 14+ for user, session, reset_request, and auth_event tables.

**Rationale**:
- **ACID transactions**: Ensures duplicate registration prevention (unique email constraint), reset token single-use enforcement (atomic increment), session consistency.
- **Row-level security ready**: Future auth enhancements (e.g., per-user access control) can leverage PostgreSQL RLS.
- **Operational familiarity**: Standard choice for web applications; mature monitoring and backup tooling.

### Jest for Testing

**Decision**: Jest 29+ with ts-jest for unit and integration tests.

**Rationale**:
- **TypeScript native**: ts-jest enables seamless transpilation of `.ts` test files.
- **Snapshot testing**: Useful for API response contracts and email template validation.
- **Mocking**: Built-in mock/stub utilities for database and email provider simulation.
- **80% coverage target**: Jest coverage reports integrate with CI/CD gates.

## Integration Points

- **Email Provider**: Assumed operational; fallback/retry logic handled via nodemailer + in-memory queue (3 retries, backoff). Specific provider (SendGrid, AWS SES, etc.) deferred to config.
- **Existing Protected Features**: Assume consuming applications expect `Authorization: Bearer <JWT>` header; contract defined in `contracts/` for validation.

## Non-Functional Considerations

- **Logging**: All authentication events (register, login, failed attempts, resets, revocations) logged with correlation IDs for audit and abuse detection.
- **Rate Limiting**: Deferred to reverse proxy (nginx, AWS ALB) or separate middleware package; not in scope for v1.
- **Monitoring**: Operational metrics (token refresh rate, reset retry failures, lockout frequency) logged; dashboards/alerts deferred to ops team.

## Assumptions Confirmed

1. Email delivery capability operational (assumed).
2. Target platform Node.js 18+ LTS (confirmed in Technical Context).
3. Brownfield integration with existing protected features (confirmed).
4. 24-hour session window uniform across all devices and user roles (confirmed).

## Dependencies Resolved

- **jsonwebtoken**: Industry standard JWT library for Node.js; supports HS256, RS256 key algorithms.
- **nodemailer**: Cross-platform email sending; supports SMTP, OAuth2, transports for various providers.
- **pg**: Mature PostgreSQL client for Node.js; supports connection pooling and prepared statements.
- **express**: Minimal web framework; widely adopted for TypeScript API development.

## Next Steps

Proceed to Phase 1: Generate data-model.md (schema design), contracts/ (API specs), and quickstart.md (development setup).
