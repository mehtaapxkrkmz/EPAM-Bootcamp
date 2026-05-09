# Security Notes

## Password Policy

- Minimum 12 characters.
- Must include uppercase, lowercase, number, and symbol.

## Password Storage

- Passwords are hashed with bcrypt.
- `BCRYPT_ROUNDS` is configurable; default 10.
- Plaintext passwords are never persisted.

## JWT Policy

- JWT algorithm: configurable via `JWT_ALGORITHM` (default HS256).
- Absolute expiry: 24 hours from issuance.
- Server-side session record is stored for revocation checks.

## Session Revocation

- Logout revokes current session (jti).
- Password reset revokes all active user sessions.
- Protected endpoints validate both JWT signature and active session state.

## Lockout Policy

- Lockout after 5 failed login attempts.
- Escalation within 24h window: 15 minutes -> 1 hour -> 24 hours.
- Account statuses: `active`, `locked`, `suspended`.

## Reset Email Delivery

- Generic response prevents account enumeration.
- Retry queue attempts up to 3 deliveries.
- Operational failures are logged in auth events.

## Audit Events

- Auth events include correlation IDs.
- Event types include login failures, lockout triggers, reset requests, and session revocations.
