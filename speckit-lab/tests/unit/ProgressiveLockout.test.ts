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
