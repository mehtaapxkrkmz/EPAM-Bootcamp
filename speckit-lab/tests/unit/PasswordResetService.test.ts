process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';

import { PasswordResetService } from '../../src/services/PasswordResetService';
import { CryptoService } from '../../src/services/CryptoService';
import { EmailService } from '../../src/services/EmailService';
import { AuthService } from '../../src/services/AuthService';
import { SessionManager } from '../../src/services/SessionManager';

describe('PasswordResetService', () => {
  it('generates reset token with expected entropy shape', () => {
    const cryptoService = new CryptoService();
    const token = cryptoService.generateResetToken();
    expect(token).toHaveLength(64);
    expect(/^[a-f0-9]+$/.test(token)).toBe(true);
  });

  it('hashes reset tokens deterministically for lookup', () => {
    const cryptoService = new CryptoService();
    const token = cryptoService.generateResetToken();
    expect(cryptoService.hashToken(token)).toBe(cryptoService.hashToken(token));
  });

  it('can be constructed with explicit service dependencies', () => {
    const cryptoService = new CryptoService();
    const emailService = new EmailService();
    const sessionManager = new SessionManager();
    const authService = new AuthService(cryptoService, sessionManager);
    const resetService = new PasswordResetService(
      cryptoService,
      emailService,
      authService,
      sessionManager,
    );

    expect(resetService).toBeInstanceOf(PasswordResetService);
  });
});
