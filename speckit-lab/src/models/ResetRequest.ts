import { ResetRequest } from '../lib/types';

/** Domain model for a password reset request token lifecycle. */
export class ResetRequestModel {
  public readonly data: ResetRequest;

  public constructor(data: ResetRequest) {
    this.data = data;
  }

  /** Returns whether a reset token can still be used at current time. */
  public isUsable(now: Date): boolean {
    if (this.data.used_at) {
      return false;
    }
    return this.data.expires_at > now;
  }
}
