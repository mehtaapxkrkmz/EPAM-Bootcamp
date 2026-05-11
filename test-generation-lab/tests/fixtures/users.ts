import { User } from '../../src/lib/types';

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  email: 'user@example.com',
  password_hash: 'hash',
  status: 'active',
  lockout_until: null,
  failed_login_attempts: 0,
  lockout_count_24h: 0,
  lockout_window_start: null,
  last_login_at: null,
  password_changed_at: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});
