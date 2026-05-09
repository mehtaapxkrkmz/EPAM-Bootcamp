import { User as UserRecord, UserStatus } from '../lib/types';

/** Domain model representing a user account. */
export class UserModel {
  public readonly data: UserRecord;

  public constructor(data: UserRecord) {
    this.data = data;
  }

  /** Returns whether the account can currently authenticate. */
  public canAuthenticate(now: Date): boolean {
    if (this.data.status === 'suspended') {
      return false;
    }
    if (this.data.status === 'locked' && this.data.lockout_until && this.data.lockout_until > now) {
      return false;
    }
    return true;
  }

  /** Creates an updated user status while preserving other fields. */
  public withStatus(status: UserStatus): UserModel {
    return new UserModel({ ...this.data, status });
  }
}
