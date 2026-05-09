process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';

import { AuthService } from '../../src/services/AuthService';
import { CryptoService } from '../../src/services/CryptoService';
import { SessionManager } from '../../src/services/SessionManager';

describe('PasswordValidation', () => {
  const service = new AuthService(new CryptoService(), new SessionManager());

  it('accepts compliant passwords', () => {
    expect(() => service.validatePasswordPolicy('StrongP@ssw0rd!')).not.toThrow();
  });

  it('rejects short passwords', () => {
    expect(() => service.validatePasswordPolicy('Short1!')).toThrow('invalid_password');
  });

  it('rejects passwords missing symbol', () => {
    expect(() => service.validatePasswordPolicy('StrongPassw0rd')).toThrow('invalid_password');
  });
});
