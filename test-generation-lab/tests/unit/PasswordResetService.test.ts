process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';

import { PasswordResetService } from '../../src/services/PasswordResetService';
import { CryptoService } from '../../src/services/CryptoService';
import { EmailService } from '../../src/services/EmailService';
import { AuthService } from '../../src/services/AuthService';
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
import { ResetRequest, User } from '../../src/lib/types';

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

const makeResetRequest = (overrides: Partial<ResetRequest> = {}): ResetRequest => {
  const now = new Date();

  return {
    id: 1,
    user_id: 1,
    reset_token_hash: 'hash',
    issued_at: now,
    expires_at: new Date(now.getTime() + 15 * 60 * 1000),
    used_at: null,
    redeemed_by_user_id: null,
    created_at: now,
    ...overrides,
  };
};

describe('PasswordResetService', () => {
  it('generates reset token with expected entropy shape', () => {
    const cryptoService = new CryptoService();
    const token = cryptoService.generateResetToken();
    expect(token).toHaveLength(64);
    expect(/^[a-f0-9]+$/.test(token)).toBe(true);
  });

  it('hashes reset tokens deterministically for lookup', () => {
    const cryptoService = new CryptoService();
    const token = cryptoService.generateResetToken();
    const hash1 = cryptoService.hashToken(token);
    const hash2 = cryptoService.hashToken(token);
    // Verify determinism: same token produces same hash
    expect(hash1).toBe(hash2);
    // Verify different tokens produce different hashes
    const anotherToken = cryptoService.generateResetToken();
    expect(hash1).not.toBe(cryptoService.hashToken(anotherToken));
  });

  it('can be constructed with explicit service dependencies', () => {
    const cryptoService = new CryptoService();
    const emailService = new EmailService();
    const sessionManager = new SessionManager();
    const authService = new AuthService(cryptoService, sessionManager);
    const resetService = new PasswordResetService(
      cryptoService,
      emailService,
      authService,
      sessionManager,
    );

    expect(resetService).toBeInstanceOf(PasswordResetService);
  });

  describe('service behavior', () => {
    const cryptoService = new CryptoService();
    const emailService = new EmailService();
    const sessionManager = new SessionManager();
    const authService = new AuthService(cryptoService, sessionManager);
    const resetService = new PasswordResetService(
      cryptoService,
      emailService,
      authService,
      sessionManager,
    );

    beforeEach(() => {
      queryMock.mockReset();
      logMock.mockReset();
    });

    it('logs a pending reset request when the user does not exist', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });

      await resetService.requestReset('missing@example.com', '550e8400-e29b-41d4-a716-446655440020');

      expect(queryMock).toHaveBeenCalledTimes(2);
      expect(queryMock.mock.calls[1][0]).toContain('INSERT INTO auth_events');
    });

    it('queues a reset email and logs success for an existing user', async () => {
      const user = await makeUser({ id: 5, email: 'present@example.com' });
      queryMock
        .mockResolvedValueOnce({ rows: [user] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      await resetService.requestReset('  Present@Example.com  ', '550e8400-e29b-41d4-a716-446655440021');

      expect(queryMock.mock.calls[0][1]).toEqual(['present@example.com']);
      expect(queryMock.mock.calls[1][0]).toContain('INSERT INTO reset_requests');
      expect(queryMock.mock.calls[2][0]).toContain('INSERT INTO auth_events');
    });

    it('logs a failure when reset email delivery throws', async () => {
      const user = await makeUser({ id: 6, email: 'fail@example.com' });
      queryMock
        .mockResolvedValueOnce({ rows: [user] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      jest.spyOn(emailService, 'sendResetEmail').mockRejectedValueOnce(new Error('smtp down'));

      await resetService.requestReset('fail@example.com', '550e8400-e29b-41d4-a716-446655440022');

      expect(queryMock.mock.calls[2][0]).toContain('INSERT INTO auth_events');
      expect(logMock).toHaveBeenCalledWith(
        'warn',
        'reset_email_failed',
        expect.objectContaining({ correlationId: '550e8400-e29b-41d4-a716-446655440022' }),
      );
    });

    it('rejects invalid reset tokens before using the password policy', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });

      await expect(resetService.validateResetToken('missing-token')).rejects.toThrow(
        'invalid_reset_token',
      );
    });

    it('rejects already used reset tokens', async () => {
      queryMock.mockResolvedValueOnce({ rows: [makeResetRequest({ used_at: new Date() })] });

      await expect(resetService.validateResetToken('used-token')).rejects.toThrow(
        'reset_token_already_used',
      );
    });

    it('rejects expired reset tokens', async () => {
      queryMock.mockResolvedValueOnce(
        { rows: [makeResetRequest({ expires_at: new Date(Date.now() - 1000) })] },
      );

      await expect(resetService.validateResetToken('expired-token')).rejects.toThrow(
        'reset_token_expired',
      );
    });

    it('completes a reset, revokes sessions, and records success', async () => {
      const resetRequest = makeResetRequest({
        id: 11,
        user_id: 77,
        reset_token_hash: cryptoService.hashToken('reset-token'),
      });

      queryMock
        .mockResolvedValueOnce({ rows: [resetRequest] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await resetService.completeReset(
        'reset-token',
        'NewP@ssw0rd123!',
        '550e8400-e29b-41d4-a716-446655440023',
      );

      expect(result).toEqual({ userId: 77 });
      expect(queryMock.mock.calls[1][0]).toBe('BEGIN');
      expect(queryMock.mock.calls[2][0]).toContain('UPDATE users');
      expect(queryMock.mock.calls[3][0]).toContain('UPDATE reset_requests');
      expect(queryMock.mock.calls[4][0]).toContain('UPDATE sessions SET revoked_at');
      expect(queryMock.mock.calls[5][0]).toBe('COMMIT');
      expect(queryMock.mock.calls[6][0]).toContain('INSERT INTO auth_events');
    });

    it('rolls back a reset when updating the user fails', async () => {
      const resetRequest = makeResetRequest({
        id: 12,
        user_id: 88,
        reset_token_hash: cryptoService.hashToken('rollback-token'),
      });

      queryMock
        .mockResolvedValueOnce({ rows: [resetRequest] })
        .mockResolvedValueOnce({ rows: [] })
        .mockRejectedValueOnce(new Error('update failed'))
        .mockResolvedValueOnce({ rows: [] });

      await expect(
        resetService.completeReset(
          'rollback-token',
          'NewP@ssw0rd123!',
          '550e8400-e29b-41d4-a716-446655440024',
        ),
      ).rejects.toThrow('update failed');

      expect(queryMock.mock.calls[2][0]).toContain('UPDATE users');
      expect(queryMock.mock.calls[3][0]).toBe('ROLLBACK');
    });

    it('removes expired reset tokens older than seven days past expiry', async () => {
      queryMock.mockResolvedValueOnce({ rowCount: 4 });

      await expect(resetService.cleanupExpiredTokens()).resolves.toBe(4);

      expect(queryMock.mock.calls[0][0]).toContain('DELETE FROM reset_requests');
    });
  });
});
