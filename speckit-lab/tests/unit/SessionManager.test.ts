process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';

import { SessionModel } from '../../src/models/Session';
import { Session } from '../../src/lib/types';

const makeSession = (overrides: Partial<Session> = {}): Session => {
  const now = new Date();
  return {
    id: 1,
    user_id: 1,
    jti: 'test-jti',
    token_hash: 'hash',
    issued_at: now,
    expires_at: new Date(now.getTime() + 60 * 60 * 1000),
    revoked_at: null,
    ip_address: '127.0.0.1',
    user_agent: 'jest',
    created_at: now,
    ...overrides,
  };
};

describe('SessionManager behavior via model invariants', () => {
  it('marks an unrevoked and unexpired session as active', () => {
    const model = new SessionModel(makeSession());
    expect(model.isActive(new Date())).toBe(true);
  });

  it('marks an expired session as inactive', () => {
    const model = new SessionModel(
      makeSession({
        expires_at: new Date(Date.now() - 1000),
      }),
    );
    expect(model.isActive(new Date())).toBe(false);
  });

  it('marks a revoked session as inactive', () => {
    const model = new SessionModel(
      makeSession({
        revoked_at: new Date(),
      }),
    );
    expect(model.isActive(new Date())).toBe(false);
  });

  it('supports concurrent independent sessions for the same user', () => {
    const activeA = new SessionModel(makeSession({ jti: 'a' }));
    const activeB = new SessionModel(makeSession({ jti: 'b' }));

    expect(activeA.isActive(new Date())).toBe(true);
    expect(activeB.isActive(new Date())).toBe(true);
  });
});
