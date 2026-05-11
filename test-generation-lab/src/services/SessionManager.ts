import { dbPool } from '../lib/db';
import { Session } from '../lib/types';

/** Manages session lifecycle: issue, validate, and revoke by jti. */
export class SessionManager {
  /** Creates a session row for a new login and returns persisted record. */
  public async issueSession(params: {
    userId: number;
    jti: string;
    tokenHash: string;
    ipAddress: string | null;
    userAgent: string | null;
  }): Promise<Session> {
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + 24 * 60 * 60 * 1000);

    const result = await dbPool.query<Session>(
      `INSERT INTO sessions(user_id, jti, token_hash, issued_at, expires_at, ip_address, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        params.userId,
        params.jti,
        params.tokenHash,
        issuedAt,
        expiresAt,
        params.ipAddress,
        params.userAgent,
      ],
    );
    return result.rows[0];
  }

  /** Fetches and validates a session by jti ensuring not expired and not revoked. */
  public async validateSession(jti: string): Promise<Session | null> {
    const result = await dbPool.query<Session>('SELECT * FROM sessions WHERE jti = $1 LIMIT 1', [jti]);
    const session = result.rows[0];
    if (!session) {
      return null;
    }

    const now = new Date();
    if (session.revoked_at || new Date(session.expires_at) <= now) {
      return null;
    }

    return session;
  }

  /** Revokes one session by jti by stamping revoked_at and writing an auth event. */
  public async revokeSession(
    jti: string,
    opts?: { userId?: number; correlationId?: string },
  ): Promise<void> {
    const updated = await dbPool.query<Session>(
      'UPDATE sessions SET revoked_at = NOW() WHERE jti = $1 AND revoked_at IS NULL RETURNING *',
      [jti],
    );

    if (updated.rows.length === 0) {
      return;
    }

    const userId = opts?.userId ?? updated.rows[0].user_id;
    const correlationId = opts?.correlationId;
    if (correlationId) {
      await dbPool.query(
        `INSERT INTO auth_events(user_id, event_type, status, correlation_id)
         VALUES ($1, 'session_revoked', 'success', $2::uuid)`,
        [userId, correlationId],
      );
    }
  }

  /** Revokes all sessions for a specific user. */
  public async revokeAllForUser(userId: number): Promise<void> {
    await dbPool.query('UPDATE sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL', [
      userId,
    ]);
  }
}
