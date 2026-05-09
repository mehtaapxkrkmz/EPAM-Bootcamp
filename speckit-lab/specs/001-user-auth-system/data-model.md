# Data Model: User Authentication System

**Purpose**: Define entities, relationships, validation rules, and state transitions for authentication features.  
**Created**: 2026-05-09  
**Database**: PostgreSQL 14+

## Entity: User Account

Represents a registered user identity in the system.

### Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,            -- bcrypt hash (60 chars)
  password_salt VARCHAR(255) NOT NULL,            -- bcrypt salt
  status VARCHAR(50) NOT NULL DEFAULT 'active',   -- active, locked, suspended
  lockout_until TIMESTAMP,                        -- When lockout expires (null if not locked)
  failed_login_attempts INT DEFAULT 0,            -- Counter for progressive lockout
  last_login_at TIMESTAMP,
  password_changed_at TIMESTAMP NOT NULL,         -- Track password change for reset validation
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

### Attributes

- **id**: Unique identifier; auto-incremented.
- **email**: Unique, normalized (lowercase) email address; required for registration and password reset.
- **password_hash**: bcrypt hash (60-character fixed length); never stored plaintext.
- **password_salt**: Bcrypt salt; included for reference; typically extracted from hash.
- **status**: Account state (active, locked, suspended); locked status prevents login attempts.
- **lockout_until**: Timestamp when progressive lockout expires; null if not locked.
- **failed_login_attempts**: Counter incremented on failed login; reset to 0 on successful login or lockout expiry.
- **last_login_at**: Timestamp of most recent successful authentication.
- **password_changed_at**: Timestamp of last password change; used to invalidate old reset tokens.
- **created_at, updated_at**: Audit timestamps.

### Validation Rules

- **Email**: Must be unique (database unique constraint), valid RFC 5322 format (application validation).
- **Password**: 12+ characters, must contain uppercase, lowercase, numeric, and symbol characters (application-enforced during registration/reset).
- **Status**: Only 'active', 'locked', 'suspended' allowed.

### State Transitions

```
Registration:
  INITIAL → ACTIVE (user registers with valid email/password)

Login Failure (Progressive Lockout):
  ACTIVE + failed_login_attempts < 5 → ACTIVE (no lockout; counter incremented)
  ACTIVE + failed_login_attempts == 5 → LOCKED (lockout_until = NOW() + 15 minutes)
  LOCKED + NOW() > lockout_until → ACTIVE (failed_login_attempts reset to 0, lockout_until = null)

Password Reset:
  ACTIVE → ACTIVE (user resets password; password_changed_at updated; all sessions revoked)
  LOCKED → ACTIVE (if reset link valid; lockout cleared)

Admin Actions:
  ANY → SUSPENDED (administrator action; all sessions revoked)
```

---

## Entity: Authenticated Session

Represents a user's authenticated state, bound to an issued JWT.

### Schema

```sql
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  jti VARCHAR(255) UNIQUE NOT NULL,               -- JWT ID from token claim; used for revocation
  token_hash VARCHAR(255) NOT NULL,               -- Hash of JWT for quick lookups
  issued_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,                  -- 24 hours after issued_at
  revoked_at TIMESTAMP,                           -- Null if active; set on logout or password reset
  ip_address INET,                                -- Client IP at issuance (for audit)
  user_agent VARCHAR(500),                        -- Client User-Agent at issuance (for audit)
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_jti ON sessions(jti);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_revoked_at ON sessions(revoked_at);
```

### Attributes

- **id**: Unique identifier; auto-incremented.
- **user_id**: Foreign key to user account; cascade delete on user removal.
- **jti**: Unique JWT ID claim (typically UUID); used to identify and revoke specific tokens.
- **token_hash**: HMAC-SHA256 hash of full JWT; enables fast database lookup without storing plaintext token.
- **issued_at**: Timestamp when token was created.
- **expires_at**: Absolute expiry time (24 hours after issued_at); no refresh tokens in v1.
- **revoked_at**: Timestamp when session was revoked (logout, password reset, admin action); null if active.
- **ip_address**: Client IP address at token issuance; useful for fraud detection and audit.
- **user_agent**: Client User-Agent string; useful for device tracking and audit.

### Validation Rules

- **JTI**: Must be globally unique (database unique constraint).
- **expires_at**: Must be exactly 24 hours after issued_at.
- **revoked_at**: Can only transition from null → timestamp (immutable once set).

### State Transitions

```
Session Issuance (on login):
  INITIAL → ACTIVE (session record created; revoked_at = null)

Session Validation (on protected request):
  ACTIVE + NOW() < expires_at → ALLOWED
  ACTIVE + NOW() >= expires_at → DENIED (expired)
  revoked_at != null → DENIED (revoked)

Session Revocation (on logout, password reset, admin action):
  ACTIVE → REVOKED (revoked_at = NOW())
```

---

## Entity: Password Reset Request

Represents a temporary recovery artifact for password resets.

### Schema

```sql
CREATE TABLE reset_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  reset_token_hash VARCHAR(255) UNIQUE NOT NULL,  -- Hash of reset token (not stored plaintext)
  issued_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,                   -- 15 minutes after issued_at
  used_at TIMESTAMP,                               -- Null if unused; timestamp if consumed
  redeemed_by_user_id INT,                         -- User ID that redeemed this token (audit trail)
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (redeemed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_reset_requests_user_id ON reset_requests(user_id);
CREATE INDEX idx_reset_requests_token_hash ON reset_requests(reset_token_hash);
CREATE INDEX idx_reset_requests_expires_at ON reset_requests(expires_at);
```

### Attributes

- **id**: Unique identifier; auto-incremented.
- **user_id**: Foreign key to user account; cascade delete if user removed.
- **reset_token_hash**: HMAC-SHA256 hash of reset token; enables lookup without storing plaintext.
- **issued_at**: Timestamp when reset request was created.
- **expires_at**: Timestamp when reset link becomes invalid (15 minutes after issued_at).
- **used_at**: Timestamp when reset token was consumed; enforces single-use (null if unused).
- **redeemed_by_user_id**: User ID that successfully redeemed this token; typically same as user_id but auditable.

### Validation Rules

- **expires_at**: Must be exactly 15 minutes after issued_at.
- **used_at**: Single-use enforcement: once set to a timestamp, cannot be used again.
- **reset_token_hash**: Must be globally unique (prevents reuse).

### State Transitions

```
Reset Request Creation:
  INITIAL → PENDING (reset_requests row created; used_at = null)

Reset Link Usage (before expiry):
  PENDING + NOW() < expires_at + USER_CLICKS_LINK → LINK_VALID (email validation)
  PENDING + NOW() >= expires_at → LINK_EXPIRED (HTTP 400; user prompted to request new reset)
  PENDING + used_at != null → ALREADY_USED (HTTP 400; single-use enforcement)

Password Reset Completion:
  PENDING + VALID_LINK + NEW_PASSWORD → CONSUMED (used_at = NOW(); password updated on user; all user sessions revoked)

Auto-Cleanup:
  PENDING + NOW() > expires_at + 7_DAYS → DELETE (old reset requests cleaned up by cron job)
```

---

## Entity: Authentication Event

Auditable log of security-relevant actions.

### Schema

```sql
CREATE TABLE auth_events (
  id SERIAL PRIMARY KEY,
  user_id INT,                                     -- Null if event is pre-authentication
  event_type VARCHAR(50) NOT NULL,                 -- registration, login_success, login_failure, logout, reset_request, reset_completed, session_revoked, lockout_triggered
  status VARCHAR(50) NOT NULL,                     -- success, failure, pending
  ip_address INET,
  user_agent VARCHAR(500),
  error_code VARCHAR(100),                         -- Null if success; e.g., invalid_credentials, account_locked, token_expired
  correlation_id UUID NOT NULL,                    -- Trace requests end-to-end
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_auth_events_user_id ON auth_events(user_id);
CREATE INDEX idx_auth_events_event_type ON auth_events(event_type);
CREATE INDEX idx_auth_events_created_at ON auth_events(created_at);
CREATE INDEX idx_auth_events_correlation_id ON auth_events(correlation_id);
```

### Attributes

- **id**: Unique identifier; auto-incremented.
- **user_id**: Foreign key to user; null for pre-auth events (e.g., registration attempts with invalid emails).
- **event_type**: Type of authentication event (registration, login_success, login_failure, logout, reset_request, reset_completed, session_revoked, lockout_triggered).
- **status**: Outcome status (success, failure, pending).
- **ip_address**: Client IP address for geographic and abuse analysis.
- **user_agent**: Client User-Agent for device/browser tracking.
- **error_code**: Failure code (invalid_credentials, account_locked, email_invalid, password_weak, token_expired, etc.); null on success.
- **correlation_id**: UUID linking related events (e.g., login attempt, lockout trigger, email sent); enables request tracing.

### Usage

All events logged with correlation_id for end-to-end request tracing. Retention policy: logs kept for 90 days (configurable), then archived or purged per compliance requirements.

---

## Relationships Summary

```
Users (1) ──→ (Many) Sessions
      └──→ (Many) ResetRequests
      └──→ (Many) AuthEvents
```

- **Users → Sessions**: One user can have multiple active sessions (across devices). Sessions are revoked on logout or password reset.
- **Users → ResetRequests**: One user can have multiple reset requests (across time). Only one reset request is active at a time.
- **Users → AuthEvents**: All authentication actions logged; events reference user but remain visible even after user deletion (audit trail).

---

## Migration Strategy

Database schema initialized via SQL migrations (flyway/knex) with version numbers:

- **001-create-users.sql**: Users table with unique email and status tracking.
- **002-create-sessions.sql**: Sessions table with jti-based revocation.
- **003-create-reset-requests.sql**: ResetRequests table with 15-minute expiry and single-use enforcement.
- **004-create-auth-events.sql**: AuthEvents table with correlation IDs for audit trail.

Each migration is idempotent and includes rollback script. Migrations run on application startup (or via CI/CD pipeline).
