# Changelog

## 2026-05-09

- Added TypeScript/Express auth service scaffold.
- Added JWT + server-side sessions with revocation checks.
- Added registration, login, and logout endpoints.
- Added password reset request/completion endpoints with 15-minute token policy.
- Added progressive lockout with multi-tier escalation.
- Added SQL migrations for users, sessions, reset_requests, and auth_events.
- Added Jest test scaffolding for unit and integration suites.
- Added CI workflow, linting/formatting config, and environment template.
