process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';

import { CryptoService } from '../../src/services/CryptoService';

describe('CryptoService', () => {
  const cryptoService = new CryptoService();

  it('hashes and verifies password', async () => {
    const hash = await cryptoService.hashPassword('StrongP@ssw0rd!');
    const ok = await cryptoService.verifyPassword('StrongP@ssw0rd!', hash);
    expect(ok).toBe(true);
  });

  it('issues and verifies jwt', () => {
    const token = cryptoService.signJwt({
      sub: '1',
      email: 'user@example.com',
      jti: cryptoService.generateJti(),
    });
    const payload = cryptoService.verifyJwt(token);
    expect(payload.sub).toBe('1');
    expect(payload.email).toBe('user@example.com');
  });

  it('produces deterministic hash for same token input', () => {
    const value = 'abc123';
    expect(cryptoService.hashToken(value)).toBe(cryptoService.hashToken(value));
  });
});
