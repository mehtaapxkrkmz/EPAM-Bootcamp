import { dbPool } from '../lib/db';
import { log } from '../lib/logger';
import { ResetRequest, User } from '../lib/types';
import { AuthService } from './AuthService';
import { CryptoService } from './CryptoService';
import { EmailService } from './EmailService';
import { SessionManager } from './SessionManager';

/** Handles password reset request issuance and completion lifecycle. */
export class PasswordResetService {
  public constructor(
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
    private readonly sessionManager: SessionManager,
  ) {}

  /** Queues reset email for existing account while preserving generic response semantics. */
  public async requestReset(email: string, correlationId: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const userResult = await dbPool.query<User>('SELECT * FROM users WHERE email = $1 LIMIT 1', [
      normalizedEmail,
    ]);

    if (userResult.rows.length === 0) {
      await this.logResetEvent(null, 'reset_request', 'pending', correlationId, null);
      return;
    }

    const user = userResult.rows[0];
    const resetToken = this.cryptoService.generateResetToken();
    const tokenHash = this.cryptoService.hashToken(resetToken);
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + 15 * 60 * 1000);

    await dbPool.query(
      `INSERT INTO reset_requests(user_id, reset_token_hash, issued_at, expires_at)
       VALUES ($1,$2,$3,$4)`,
      [user.id, tokenHash, issuedAt, expiresAt],
    );

    try {
      await this.emailService.sendResetEmail({
        email: user.email,
        resetToken,
        correlationId,
      });
      await this.logResetEvent(user.id, 'reset_request', 'success', correlationId, null);
    } catch (error) {
      await this.logResetEvent(user.id, 'reset_email_failed', 'failure', correlationId, 'email_send_failed');
      log('warn', 'reset_email_failed', { correlationId, error: String(error) });
    }
  }

  /** Validates reset token against hash, expiry, and single-use conditions. */
  public async validateResetToken(resetToken: string): Promise<ResetRequest> {
    const tokenHash = this.cryptoService.hashToken(resetToken);
    const result = await dbPool.query<ResetRequest>(
      'SELECT * FROM reset_requests WHERE reset_token_hash = $1 LIMIT 1',
      [tokenHash],
    );

    const request = result.rows[0];
    if (!request) {
      throw new Error('invalid_reset_token');
    }
    if (request.used_at) {
      throw new Error('reset_token_already_used');
    }
    if (new Date(request.expires_at) <= new Date()) {
      throw new Error('reset_token_expired');
    }

    return request;
  }

  /** Completes password reset and revokes all active sessions for the user. */
  public async completeReset(
    resetToken: string,
    newPassword: string,
    correlationId: string,
  ): Promise<{ userId: number }> {
    const resetRequest = await this.validateResetToken(resetToken);
    this.authService.validatePasswordPolicy(newPassword);

    const passwordHash = await this.cryptoService.hashPassword(newPassword);

    await dbPool.query('BEGIN');
    try {
      await dbPool.query(
        `UPDATE users
         SET password_hash = $2,
             password_changed_at = NOW(),
             failed_login_attempts = 0,
             status = 'active',
             lockout_until = NULL,
             updated_at = NOW()
         WHERE id = $1`,
        [resetRequest.user_id, passwordHash],
      );

      await dbPool.query(
        `UPDATE reset_requests
         SET used_at = NOW(), redeemed_by_user_id = $2
         WHERE id = $1`,
        [resetRequest.id, resetRequest.user_id],
      );

      await this.sessionManager.revokeAllForUser(resetRequest.user_id);

      await dbPool.query('COMMIT');
    } catch (error) {
      await dbPool.query('ROLLBACK');
      throw error;
    }

    await this.logResetEvent(resetRequest.user_id, 'reset_completed', 'success', correlationId, null);
    return { userId: resetRequest.user_id };
  }

  /** Deletes stale reset requests older than seven days past expiry. */
  public async cleanupExpiredTokens(): Promise<number> {
    const result = await dbPool.query(
      `DELETE FROM reset_requests
       WHERE expires_at < NOW() - INTERVAL '7 days'`,
    );
    return result.rowCount ?? 0;
  }

  private async logResetEvent(
    userId: number | null,
    eventType: string,
    status: 'success' | 'failure' | 'pending',
    correlationId: string,
    errorCode: string | null,
  ): Promise<void> {
    await dbPool.query(
      `INSERT INTO auth_events(user_id, event_type, status, error_code, correlation_id)
       VALUES ($1,$2,$3,$4,$5::uuid)`,
      [userId, eventType, status, errorCode, correlationId],
    );
  }
}
