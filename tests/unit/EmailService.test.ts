process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';
process.env.EMAIL_PROVIDER = 'test';

import { EmailService } from '../../src/services/EmailService';

describe('EmailService', () => {
  it('succeeds on test provider', async () => {
    const service = new EmailService();
    await expect(
      service.sendResetEmail({
        email: 'user@example.com',
        resetToken: 'token',
        correlationId: '550e8400-e29b-41d4-a716-446655440000',
      }),
    ).resolves.toBeUndefined();
  });
});
