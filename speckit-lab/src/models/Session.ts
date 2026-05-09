import { Session as SessionRecord } from '../lib/types';

/** Domain model representing an authenticated session bound to a JWT jti. */
export class SessionModel {
  public readonly data: SessionRecord;

  public constructor(data: SessionRecord) {
    this.data = data;
  }

  /** Returns true when session is active and not expired or revoked. */
  public isActive(now: Date): boolean {
    if (this.data.revoked_at) {
      return false;
    }
    return this.data.expires_at > now;
  }
}
