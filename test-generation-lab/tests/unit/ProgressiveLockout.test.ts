process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';

import { UserModel } from '../../src/models/User';
import { makeUser } from '../fixtures/users';

describe('ProgressiveLockout', () => {
  it('blocks authentication for a suspended user', () => {
    const model = new UserModel(makeUser({ status: 'suspended' }));
    expect(model.canAuthenticate(new Date())).toBe(false);
  });

  it('allows authentication for an active user with no lockout', () => {
    const model = new UserModel(makeUser({ status: 'active', lockout_until: null }));
    expect(model.canAuthenticate(new Date())).toBe(true);
  });

  it('allows authentication for a locked user whose lockout_until is null', () => {
    const model = new UserModel(makeUser({ status: 'locked', lockout_until: null }));
    expect(model.canAuthenticate(new Date())).toBe(true);
  });

  it('allows authentication when lockout_until equals now exactly (boundary: > not >=)', () => {
    const now = new Date('2026-05-11T12:00:00.000Z');
    const model = new UserModel(makeUser({ status: 'locked', lockout_until: now }));
    expect(model.canAuthenticate(now)).toBe(true);
  });

  it('blocks authentication while lockout is active', () => {
    const model = new UserModel(
      makeUser({
        status: 'locked',
        lockout_until: new Date(Date.now() + 5 * 60 * 1000),
      }),
    );

    expect(model.canAuthenticate(new Date())).toBe(false);
  });

  it('allows authentication after lockout expires', () => {
    const model = new UserModel(
      makeUser({
        status: 'locked',
        lockout_until: new Date(Date.now() - 5 * 60 * 1000),
      }),
    );

    expect(model.canAuthenticate(new Date())).toBe(true);
  });
});

describe('UserModel.withStatus', () => {
  it('returns a new UserModel with the updated status', () => {
    const original = new UserModel(makeUser({ status: 'active' }));
    const updated = original.withStatus('suspended');
    expect(updated).toBeInstanceOf(UserModel);
    expect(updated.data.status).toBe('suspended');
  });

  it('preserves all other fields when changing status', () => {
    const data = makeUser({ status: 'active', email: 'keep@example.com' });
    const updated = new UserModel(data).withStatus('locked');
    expect(updated.data.email).toBe('keep@example.com');
    expect(updated.data.id).toBe(data.id);
    expect(updated.data.password_hash).toBe(data.password_hash);
  });
});
