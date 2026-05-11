# Architecture

## Module Boundaries

- `src/models/`: domain models and behavior helpers.
- `src/services/`: business logic (auth, sessions, reset, crypto, email).
- `src/middleware/`: request concerns (auth and error handling).
- `src/routes/`: endpoint handlers and router mounting.
- `src/lib/`: config, DB, logger, and shared types.

## Request Flow

1. Request enters Express app (`src/app.ts`).
2. Correlation middleware assigns `correlationId`.
3. Route handler validates request payload.
4. Service layer executes business logic.
5. DB writes to users/sessions/reset_requests/auth_events.
6. Errors map to non-sensitive API responses through error handler.

## Authentication Flow

- Login verifies credentials with bcrypt.
- JWT issued with `jti`.
- Session row persisted with expiry and revocation fields.
- Protected routes verify JWT and active server-side session.

## Password Reset Flow

- Reset request stores hashed token and 15-minute expiry.
- Generic response returned for both existing/non-existing users.
- Completion updates password and revokes all active sessions.

## Data Layer

Migrations in `db/migrations/` define:

- `users`
- `sessions`
- `reset_requests`
- `auth_events`
