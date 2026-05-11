import { ResetRequestModel } from '../../src/models/ResetRequest';
import { ResetRequest } from '../../src/lib/types';

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

describe('ResetRequestModel', () => {
  it('constructs a model and exposes data', () => {
    const data = makeResetRequest();
    const model = new ResetRequestModel(data);
    expect(model.data).toBe(data);
  });

  it('returns true when token is unused and not yet expired', () => {
    const now = new Date();
    const model = new ResetRequestModel(
      makeResetRequest({ expires_at: new Date(now.getTime() + 5 * 60 * 1000), used_at: null }),
    );
    expect(model.isUsable(now)).toBe(true);
  });

  it('returns false when the token has already been used', () => {
    const now = new Date();
    const model = new ResetRequestModel(
      makeResetRequest({ used_at: new Date(now.getTime() - 60 * 1000) }),
    );
    expect(model.isUsable(now)).toBe(false);
  });

  it('returns false when the token is expired', () => {
    const now = new Date();
    const model = new ResetRequestModel(
      makeResetRequest({
        expires_at: new Date(now.getTime() - 1000),
        used_at: null,
      }),
    );
    expect(model.isUsable(now)).toBe(false);
  });

  it('returns false when expires_at equals now exactly (boundary: > not >=)', () => {
    const now = new Date('2026-05-11T12:00:00.000Z');
    const model = new ResetRequestModel(
      makeResetRequest({ expires_at: now, used_at: null }),
    );
    // expires_at > now is false when they are equal, so the token is NOT usable
    expect(model.isUsable(now)).toBe(false);
  });

  it('returns false even when expires_at is in future if used_at is set', () => {
    const now = new Date();
    const model = new ResetRequestModel(
      makeResetRequest({
        expires_at: new Date(now.getTime() + 10 * 60 * 1000),
        used_at: new Date(now.getTime() - 30 * 1000),
      }),
    );
    expect(model.isUsable(now)).toBe(false);
  });
});
