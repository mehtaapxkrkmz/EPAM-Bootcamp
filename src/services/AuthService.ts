import { dbPool } from '../lib/db';
import { log } from '../lib/logger';
import { LoginResponse, User } from '../lib/types';
import { CryptoService } from './CryptoService';
import { SessionManager } from './SessionManager';

/** Encapsulates registration, login, and logout business logic. */
export class AuthService {
  public constructor(
    private readonly cryptoService: CryptoService,
    private readonly sessionManager: SessionManager,
  ) {}

  /** Registers a new account after validating password policy and uniqueness. */
  public async registerUser(email: string, password: string, correlationId: string): Promise<User> {
    this.validatePasswordPolicy(password);
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await dbPool.query<User>('SELECT * FROM users WHERE email = $1 LIMIT 1', [
      normalizedEmail,
    ]);
    if (existing.rows.length > 0) {
      throw new Error('duplicate_email');
    }

    const passwordHash = await this.cryptoService.hashPassword(password);
    const result = await dbPool.query<User>(
      `INSERT INTO users(email, password_hash, status, password_changed_at)
       VALUES ($1,$2,'active',NOW())
       RETURNING *`,
      [normalizedEmail, passwordHash],
    );

    await this.logEvent(result.rows[0].id, 'registration', 'success', correlationId, null);
    return result.rows[0];
  }

  /** Authenticates a user and issues JWT plus session record when valid. */
  public async loginUser(params: {
    email: string;
    password: string;
    ipAddress: string | null;
    userAgent: string | null;
    correlationId: string;
  }): Promise<LoginResponse> {
    const normalizedEmail = params.email.trim().toLowerCase();
    const userResult = await dbPool.query<User>('SELECT * FROM users WHERE email = $1 LIMIT 1', [
      normalizedEmail,
    ]);
    const user = userResult.rows[0];

    if (!user) {
      await this.logEvent(null, 'login_failure', 'failure', params.correlationId, 'invalid_credentials');
      throw new Error('invalid_credentials');
    }

    this.enforceProgressiveLockout(user);

    const valid = await this.cryptoService.verifyPassword(params.password, user.password_hash);
    if (!valid) {
      await this.recordFailedLogin(user.id, params.correlationId);
      throw new Error('invalid_credentials');
    }

    const staleSession = await dbPool.query<{ jti: string }>(
      `SELECT jti
       FROM sessions
       WHERE user_id = $1
         AND revoked_at IS NULL
         AND issued_at < $2
       ORDER BY issued_at ASC
       LIMIT 1`,
      [user.id, user.password_changed_at],
    );

    if (staleSession.rows.length > 0) {
      await this.sessionManager.revokeSession(staleSession.rows[0].jti, {
        userId: user.id,
        correlationId: params.correlationId,
      });
      throw new Error('stale_session_detected');
    }

    await dbPool.query(
      `UPDATE users
       SET failed_login_attempts = 0, status = 'active', lockout_until = NULL, last_login_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [user.id],
    );

    const jti = this.cryptoService.generateJti();
    const token = this.cryptoService.signJwt({
      sub: String(user.id),
      email: user.email,
      jti,
    });

    await this.sessionManager.issueSession({
      userId: user.id,
      jti,
      tokenHash: this.cryptoService.hashToken(token),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });

    await this.logEvent(user.id, 'login_success', 'success', params.correlationId, null);

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 24 * 60 * 60,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  /** Revokes currently authenticated session. */
  public async logoutUser(jti: string, userId: number, correlationId: string): Promise<void> {
    await this.sessionManager.revokeSession(jti, {
      userId,
      correlationId,
    });
    await this.logEvent(userId, 'logout', 'success', correlationId, null);
  }

  /** Enforces the configured password policy from specification. */
  public validatePasswordPolicy(password: string): void {
    const hasMin = password.length >= 12;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (!hasMin || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {
      throw new Error('invalid_password');
    }
  }

  /** Applies lockout rules and rejects if user is currently blocked. */
  public enforceProgressiveLockout(user: User): void {
    if (user.status === 'suspended') {
      throw new Error('account_suspended');
    }

    if (user.status === 'locked' && user.lockout_until && new Date(user.lockout_until) > new Date()) {
      throw new Error('account_locked');
    }
  }

  private async recordFailedLogin(userId: number, correlationId: string): Promise<void> {
    const userResult = await dbPool.query<User>('SELECT * FROM users WHERE id = $1 LIMIT 1', [userId]);
    const user = userResult.rows[0];
    if (!user) {
      return;
    }

    const nextAttempts = user.failed_login_attempts + 1;
    let nextStatus: 'active' | 'locked' = 'active';
    let lockoutUntil: Date | null = null;
    let lockoutCount24h = user.lockout_count_24h;
    let lockoutWindowStart = user.lockout_window_start;

    if (nextAttempts >= 5) {
      nextStatus = 'locked';

      if (!lockoutWindowStart || new Date(lockoutWindowStart).getTime() < Date.now() - 24 * 60 * 60 * 1000) {
        lockoutWindowStart = new Date();
        lockoutCount24h = 1;
      } else {
        lockoutCount24h += 1;
      }

      const lockoutMinutes = lockoutCount24h >= 5 ? 24 * 60 : lockoutCount24h >= 3 ? 60 : 15;
      lockoutUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
    }

    await dbPool.query(
      `UPDATE users
       SET failed_login_attempts = $2,
           status = $3,
           lockout_until = $4,
           lockout_count_24h = $5,
           lockout_window_start = $6,
           updated_at = NOW()
       WHERE id = $1`,
      [userId, nextAttempts, nextStatus, lockoutUntil, lockoutCount24h, lockoutWindowStart],
    );

    await this.logEvent(userId, 'login_failure', 'failure', correlationId, 'invalid_credentials');
    if (nextStatus === 'locked') {
      await this.logEvent(userId, 'lockout_triggered', 'failure', correlationId, 'account_locked');
    }
  }

  private async logEvent(
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

    log('info', 'auth_event', {
      correlationId,
      eventType,
      status,
      userId: userId ?? undefined,
      errorCode: errorCode ?? undefined,
    });
  }
}
