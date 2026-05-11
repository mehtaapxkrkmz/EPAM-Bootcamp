process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';

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
import { User } from '../../src/lib/types';
import { AuthService } from '../../src/services/AuthService';
import { CryptoService } from '../../src/services/CryptoService';
import { SessionManager } from '../../src/services/SessionManager';

const queryMock = dbPool.query as jest.Mock;
const logMock = log as jest.Mock;

const makeUser = async (overrides: Partial<User> = {}): Promise<User> => {
  const now = new Date();
  const cryptoService = new CryptoService();

  return {
    id: 1,
    email: 'user@example.com',
    password_hash: await cryptoService.hashPassword('ValidP@ssw0rd!'),
    status: 'active',
    lockout_until: null,
    failed_login_attempts: 0,
    lockout_count_24h: 0,
    lockout_window_start: null,
    last_login_at: null,
    password_changed_at: now,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
};

describe('AuthService', () => {
  const cryptoService = new CryptoService();
  const sessionManager = new SessionManager();
  const authService = new AuthService(cryptoService, sessionManager);

  beforeEach(() => {
    queryMock.mockReset();
    logMock.mockReset();
  });

  it('registers a user after validating the password policy and uniqueness', async () => {
    const correlationId = '550e8400-e29b-41d4-a716-446655440000';
    const insertedUser = await makeUser({
      id: 42,
      email: 'new.user@example.com',
    });

    queryMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [insertedUser] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await authService.registerUser(
      '  New.User@Example.com  ',
      'ValidP@ssw0rd!',
      correlationId,
    );

    expect(result).toMatchObject({
      id: 42,
      email: 'new.user@example.com',
    });
    expect(queryMock).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      ['new.user@example.com'],
    );
    expect(queryMock.mock.calls[1][0]).toContain('INSERT INTO users');
    expect(queryMock.mock.calls[2][0]).toContain('INSERT INTO auth_events');
  });

  it('rejects duplicate registrations before inserting a user', async () => {
    queryMock.mockResolvedValueOnce({ rows: [await makeUser()] });

    await expect(
      authService.registerUser('existing@example.com', 'ValidP@ssw0rd!', '550e8400-e29b-41d4-a716-446655440001'),
    ).rejects.toThrow('duplicate_email');

    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it('rejects passwords that fail the policy checks without querying storage', async () => {
    await expect(
      authService.registerUser('bad@example.com', 'short', '550e8400-e29b-41d4-a716-446655440002'),
    ).rejects.toThrow('invalid_password');

    expect(queryMock).not.toHaveBeenCalled();
  });

  it('rejects missing users during login and logs the failure', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });

    await expect(
      authService.loginUser({
        email: 'missing@example.com',
        password: 'WrongP@ssw0rd!',
        ipAddress: '127.0.0.1',
        userAgent: 'jest',
        correlationId: '550e8400-e29b-41d4-a716-446655440003',
      }),
    ).rejects.toThrow('invalid_credentials');

    expect(queryMock).toHaveBeenCalledTimes(2);
    expect(queryMock.mock.calls[1][0]).toContain('INSERT INTO auth_events');
  });

  it('rejects suspended users before checking passwords', async () => {
    queryMock.mockResolvedValueOnce({ rows: [await makeUser({ status: 'suspended' })] });

    await expect(
      authService.loginUser({
        email: 'suspended@example.com',
        password: 'ValidP@ssw0rd!',
        ipAddress: null,
        userAgent: null,
        correlationId: '550e8400-e29b-41d4-a716-446655440004',
      }),
    ).rejects.toThrow('account_suspended');

    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it('rejects locked users whose lockout window is still active', async () => {
    queryMock.mockResolvedValueOnce({
      rows: [
        await makeUser({
          status: 'locked',
          lockout_until: new Date(Date.now() + 60 * 60 * 1000),
        }),
      ],
    });

    await expect(
      authService.loginUser({
        email: 'locked@example.com',
        password: 'ValidP@ssw0rd!',
        ipAddress: null,
        userAgent: null,
        correlationId: '550e8400-e29b-41d4-a716-446655440005',
      }),
    ).rejects.toThrow('account_locked');

    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it('retries login failure tracking without lockout when attempts stay below threshold', async () => {
    const user = await makeUser({ failed_login_attempts: 1, lockout_count_24h: 0 });
    queryMock
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    await expect(
      authService.loginUser({
        email: 'active@example.com',
        password: 'WrongP@ssw0rd!',
        ipAddress: '127.0.0.1',
        userAgent: 'jest',
        correlationId: '550e8400-e29b-41d4-a716-446655440006',
      }),
    ).rejects.toThrow('invalid_credentials');

    expect(queryMock.mock.calls[2][0]).toContain('UPDATE users');
    expect(queryMock.mock.calls[2][1][1]).toBe(2);
    expect(queryMock.mock.calls[2][1][2]).toBe('active');
    expect(queryMock.mock.calls[2][1][3]).toBeNull();
    expect(queryMock.mock.calls[2][1][4]).toBe(0);
    expect(queryMock.mock.calls[2][1][5]).toBeNull();
    expect(queryMock.mock.calls[3][0]).toContain('INSERT INTO auth_events');
  });

  it('locks an account for 15 minutes on the first threshold breach', async () => {
    const user = await makeUser({ failed_login_attempts: 4, lockout_count_24h: 0, lockout_window_start: null });
    queryMock
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const startedAt = Date.now();

    await expect(
      authService.loginUser({
        email: 'lock15@example.com',
        password: 'WrongP@ssw0rd!',
        ipAddress: null,
        userAgent: null,
        correlationId: '550e8400-e29b-41d4-a716-446655440007',
      }),
    ).rejects.toThrow('invalid_credentials');

    const updateParams = queryMock.mock.calls[2][1];
    expect(updateParams[2]).toBe('locked');
    expect(updateParams[3]).toBeInstanceOf(Date);
    expect(Math.round((updateParams[3].getTime() - startedAt) / 60000)).toBe(15);
    expect(updateParams[4]).toBe(1);
    expect(queryMock.mock.calls[4][0]).toContain('INSERT INTO auth_events');
  });

  it('extends lockout to 60 minutes when the 24h counter reaches three', async () => {
    const user = await makeUser({
      failed_login_attempts: 4,
      lockout_count_24h: 2,
      lockout_window_start: new Date(Date.now() - 30 * 60 * 1000),
    });

    queryMock
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const startedAt = Date.now();

    await expect(
      authService.loginUser({
        email: 'lock60@example.com',
        password: 'WrongP@ssw0rd!',
        ipAddress: null,
        userAgent: null,
        correlationId: '550e8400-e29b-41d4-a716-446655440008',
      }),
    ).rejects.toThrow('invalid_credentials');

    const updateParams = queryMock.mock.calls[2][1];
    expect(Math.round((updateParams[3].getTime() - startedAt) / 60000)).toBe(60);
    expect(updateParams[4]).toBe(3);
  });

  it('treats a 23.9 hour lockout window as still active', async () => {
    const user = await makeUser({
      failed_login_attempts: 4,
      lockout_count_24h: 2,
      lockout_window_start: new Date(Date.now() - (23 * 60 * 60 * 1000 + 54 * 60 * 1000)),
    });

    queryMock
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const startedAt = Date.now();

    await expect(
      authService.loginUser({
        email: 'lock239@example.com',
        password: 'WrongP@ssw0rd!',
        ipAddress: null,
        userAgent: null,
        correlationId: '550e8400-e29b-41d4-a716-44665544000a',
      }),
    ).rejects.toThrow('invalid_credentials');

    const updateParams = queryMock.mock.calls[2][1];
    expect(updateParams[2]).toBe('locked');
    expect(updateParams[4]).toBe(3);
    expect(Math.round((updateParams[3].getTime() - startedAt) / 60000)).toBe(60);
  });

  it('resets the 24h lockout window once it is older than 24 hours', async () => {
    const user = await makeUser({
      failed_login_attempts: 4,
      lockout_count_24h: 2,
      lockout_window_start: new Date(Date.now() - (24 * 60 * 60 * 1000 + 6 * 60 * 1000)),
    });

    queryMock
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const startedAt = Date.now();

    await expect(
      authService.loginUser({
        email: 'lock241@example.com',
        password: 'WrongP@ssw0rd!',
        ipAddress: null,
        userAgent: null,
        correlationId: '550e8400-e29b-41d4-a716-44665544000b',
      }),
    ).rejects.toThrow('invalid_credentials');

    const updateParams = queryMock.mock.calls[2][1];
    expect(updateParams[2]).toBe('locked');
    expect(updateParams[4]).toBe(1);
    expect(Math.round((updateParams[3].getTime() - startedAt) / 60000)).toBe(15);
  });

  it('extends lockout to 24 hours when the 24h counter reaches five', async () => {
    const user = await makeUser({
      failed_login_attempts: 4,
      lockout_count_24h: 4,
      lockout_window_start: new Date(Date.now() - 30 * 60 * 1000),
    });

    queryMock
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const startedAt = Date.now();

    await expect(
      authService.loginUser({
        email: 'lock24@example.com',
        password: 'WrongP@ssw0rd!',
        ipAddress: null,
        userAgent: null,
        correlationId: '550e8400-e29b-41d4-a716-446655440009',
      }),
    ).rejects.toThrow('invalid_credentials');

    const updateParams = queryMock.mock.calls[2][1];
    expect(Math.round((updateParams[3].getTime() - startedAt) / 60000)).toBe(24 * 60);
    expect(updateParams[4]).toBe(5);
  });

  it('logs in successfully, issues a session, and returns a signed token payload', async () => {
    const passwordHash = await cryptoService.hashPassword('ValidP@ssw0rd!');
    const user = await makeUser({
      id: 99,
      email: 'login@example.com',
      password_hash: passwordHash,
      failed_login_attempts: 2,
      status: 'active',
    });

    queryMock
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            user_id: 99,
            jti: 'issued-jti',
            token_hash: cryptoService.hashToken('issued-token'),
            issued_at: new Date(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
            revoked_at: null,
            ip_address: '10.0.0.1',
            user_agent: 'jest',
            created_at: new Date(),
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await authService.loginUser({
      email: '  LOGIN@Example.com  ',
      password: 'ValidP@ssw0rd!',
      ipAddress: '10.0.0.1',
      userAgent: 'jest',
      correlationId: '550e8400-e29b-41d4-a716-446655440010',
    });

    expect(response.token_type).toBe('Bearer');
    expect(response.user).toEqual({
      id: 99,
      email: 'login@example.com',
    });
    expect(cryptoService.verifyJwt(response.access_token).sub).toBe('99');
    expect(queryMock.mock.calls[2][0]).toContain('UPDATE users');
    expect(queryMock.mock.calls[3][0]).toContain('INSERT INTO sessions');
    expect(queryMock.mock.calls[4][0]).toContain('INSERT INTO auth_events');
  });

  it('revokes stale sessions before accepting a login', async () => {
    const passwordHash = await cryptoService.hashPassword('ValidP@ssw0rd!');
    const user = await makeUser({
      id: 7,
      email: 'stale@example.com',
      password_hash: passwordHash,
    });

    queryMock
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [{ jti: 'stale-jti' }] })
      .mockResolvedValueOnce({ rows: [{ user_id: 7 }] })
      .mockResolvedValueOnce({ rows: [] });

    await expect(
      authService.loginUser({
        email: 'stale@example.com',
        password: 'ValidP@ssw0rd!',
        ipAddress: null,
        userAgent: null,
        correlationId: '550e8400-e29b-41d4-a716-446655440011',
      }),
    ).rejects.toThrow('stale_session_detected');

    expect(queryMock.mock.calls[2][0]).toContain('UPDATE sessions SET revoked_at');
    expect(queryMock.mock.calls[3][0]).toContain('INSERT INTO auth_events');
  });

  it('revokes the current session on logout and writes an event', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [{ user_id: 123, jti: 'current-jti' }] })
      .mockResolvedValueOnce({ rows: [{ user_id: 123, jti: 'current-jti' }] })
      .mockResolvedValueOnce({ rows: [] });

    await authService.logoutUser('current-jti', 123, '550e8400-e29b-41d4-a716-446655440012');

    expect(queryMock.mock.calls[0][0]).toContain('UPDATE sessions SET revoked_at');
    expect(queryMock.mock.calls[1][0]).toContain('INSERT INTO auth_events');
    expect(queryMock.mock.calls[2][0]).toContain('INSERT INTO auth_events');
  });
});