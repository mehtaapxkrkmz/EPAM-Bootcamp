# Testing Guide

## Test Layout

- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Fixtures: `tests/fixtures/`

## Commands

- Run unit tests: `npm run test:unit`
- Run integration tests: `npm run test:integration`
- Run all tests with coverage: `npm run test:coverage`

## Coverage

Coverage is collected from:

- `src/services/**/*.ts`
- `src/models/**/*.ts`

Target threshold:

- >= 80% line coverage

## Pyramid Strategy

- Unit tests should dominate the suite.
- Integration tests verify end-to-end user journeys and edge cases.
- External behavior (DB/SMTP failures) is covered via integration scenarios.

## Notes

Some integration scenarios are marked skipped until local DB and email test harnesses are wired in CI runtime.
