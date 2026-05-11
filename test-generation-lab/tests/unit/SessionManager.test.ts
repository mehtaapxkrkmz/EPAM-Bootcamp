process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';

import { SessionModel } from '../../src/models/Session';
import { Session } from '../../src/lib/types';
import { SessionManager } from '../../src/services/SessionManager';

jest.mock('../../src/lib/db', () => ({
  dbPool: {
    query: jest.fn(),
  },
}));

jest.mock('../../src/lib/logger', () => ({
  log: jest.fn(),
}));

import { dbPool } from '../../src/lib/db';
import { log } from '../../src/lib/logger';

const queryMock = dbPool.query as jest.Mock;
const logMock = log as jest.Mock;

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

describe('SessionManager service behavior', () => {
  const sessionManager = new SessionManager();

  beforeEach(() => {
    queryMock.mockReset();
    logMock.mockReset();
  });

  it('issues a session record with a 24-hour expiry', async () => {
    const now = new Date('2026-05-11T10:00:00.000Z');
    const issued = makeSession({
      id: 9,
      user_id: 9,
      jti: 'issued-jti',
      created_at: now,
      issued_at: now,
      expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      token_hash: 'issued-token-hash',
    });

    queryMock.mockResolvedValueOnce({ rows: [issued] });

    const result = await sessionManager.issueSession({
      userId: 9,
      jti: 'issued-jti',
      tokenHash: 'issued-token-hash',
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    });

    expect(result).toEqual(issued);
    expect(queryMock.mock.calls[0][0]).toContain('INSERT INTO sessions');
    expect(queryMock.mock.calls[0][1][0]).toBe(9);
    expect(queryMock.mock.calls[0][1][1]).toBe('issued-jti');
  });

  it('inserts expires_at exactly 24 hours after issued_at', async () => {
    queryMock.mockResolvedValueOnce({ rows: [makeSession()] });

    await sessionManager.issueSession({
      userId: 1,
      jti: 'timing-jti',
      tokenHash: 'hash',
      ipAddress: null,
      userAgent: null,
    });

    const params = queryMock.mock.calls[0][1] as Date[];
    const insertedIssuedAt: Date = params[3];
    const insertedExpiresAt: Date = params[4];
    const diffMs = insertedExpiresAt.getTime() - insertedIssuedAt.getTime();
    expect(diffMs).toBe(24 * 60 * 60 * 1000);
  });

  it('returns null when a session cannot be found', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });

    await expect(sessionManager.validateSession('missing-jti')).resolves.toBeNull();
  });

  it('returns null for revoked sessions', async () => {
    queryMock.mockResolvedValueOnce({ rows: [makeSession({ revoked_at: new Date() })] });

    await expect(sessionManager.validateSession('revoked-jti')).resolves.toBeNull();
  });

  it('returns null for expired sessions', async () => {
    queryMock.mockResolvedValueOnce(
      { rows: [makeSession({ expires_at: new Date(Date.now() - 1000) })] },
    );

    await expect(sessionManager.validateSession('expired-jti')).resolves.toBeNull();
  });

  it('returns the active session when it is valid', async () => {
    const active = makeSession();
    queryMock.mockResolvedValueOnce({ rows: [active] });

    await expect(sessionManager.validateSession('active-jti')).resolves.toMatchObject({
      jti: active.jti,
      user_id: active.user_id,
    });
  });

  it('treats session expiry as valid at 23.9 hours and invalid at 24.1 hours', async () => {
    jest.useFakeTimers();

    try {
      const base = new Date('2026-05-11T10:00:00.000Z');
      const session = makeSession({
        jti: 'boundary-jti',
        expires_at: new Date(base.getTime() + 24 * 60 * 60 * 1000),
      });

      queryMock.mockResolvedValue({ rows: [session] });

      jest.setSystemTime(new Date(base.getTime() + 23 * 60 * 60 * 1000 + 54 * 60 * 1000));
      await expect(sessionManager.validateSession('boundary-jti')).resolves.toMatchObject({
        jti: 'boundary-jti',
      });

      jest.setSystemTime(new Date(base.getTime() + 24 * 60 * 60 * 1000 + 6 * 60 * 1000));
      await expect(sessionManager.validateSession('boundary-jti')).resolves.toBeNull();

      jest.setSystemTime(new Date(base.getTime() + 24 * 60 * 60 * 1000));
      await expect(sessionManager.validateSession('boundary-jti')).resolves.toBeNull();
    } finally {
      jest.useRealTimers();
    }
  });

  it('returns early when revoking a missing session', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });

    await sessionManager.revokeSession('missing-jti', { userId: 1, correlationId: '550e8400-e29b-41d4-a716-446655440030' });

    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it('revokes a session and logs an auth event when a correlation id is present', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [makeSession({ user_id: 22, jti: 'active-jti' })] })
      .mockResolvedValueOnce({ rows: [] });

    await sessionManager.revokeSession('active-jti', {
      userId: 22,
      correlationId: '550e8400-e29b-41d4-a716-446655440031',
    });

    expect(queryMock.mock.calls[0][0]).toContain('UPDATE sessions SET revoked_at');
    expect(queryMock.mock.calls[1][0]).toContain('INSERT INTO auth_events');
  });

  it('revokes a session without writing an auth event when no correlation id is provided', async () => {
    queryMock.mockResolvedValueOnce({ rows: [makeSession({ user_id: 33, jti: 'silent-jti' })] });

    await sessionManager.revokeSession('silent-jti', { userId: 33 });

    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it('revokes a session without throwing when opts is undefined', async () => {
    queryMock.mockResolvedValueOnce({ rows: [makeSession({ user_id: 55, jti: 'no-opts-jti' })] });

    // opts is undefined: opts?.userId and opts?.correlationId must not throw
    await expect(sessionManager.revokeSession('no-opts-jti')).resolves.toBeUndefined();
    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it('uses user_id from DB row when opts.userId is not provided', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [makeSession({ user_id: 77, jti: 'db-uid-jti' })] })
      .mockResolvedValueOnce({ rows: [] });

    await sessionManager.revokeSession('db-uid-jti', {
      correlationId: '550e8400-e29b-41d4-a716-446655440099',
    });

    // userId should fall back to 77 from the DB row (opts?.userId is undefined → ?? picks db value)
    expect(queryMock.mock.calls[1][1][0]).toBe(77);
    expect(queryMock.mock.calls[1][1][1]).toBe('550e8400-e29b-41d4-a716-446655440099');
  });

  it('passes exact [userId, correlationId] to auth_events INSERT', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [makeSession({ user_id: 22, jti: 'exact-jti' })] })
      .mockResolvedValueOnce({ rows: [] });

    await sessionManager.revokeSession('exact-jti', {
      userId: 22,
      correlationId: '550e8400-e29b-41d4-a716-446655440031',
    });

    expect(queryMock.mock.calls[1][1]).toEqual([22, '550e8400-e29b-41d4-a716-446655440031']);
  });

  it('revokes all active sessions for a user', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });

    await sessionManager.revokeAllForUser(44);

    expect(queryMock.mock.calls[0][0]).toContain('UPDATE sessions SET revoked_at');
    expect(queryMock.mock.calls[0][1]).toEqual([44]);
  });
});
