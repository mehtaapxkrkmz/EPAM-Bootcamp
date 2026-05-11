process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';
process.env.EMAIL_PROVIDER = 'test';

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(),
  },
}));

jest.mock('../../src/lib/logger', () => ({
  log: jest.fn(),
}));

import nodemailer from 'nodemailer';
import { log } from '../../src/lib/logger';
import { EmailService } from '../../src/services/EmailService';
import { config } from '../../src/lib/config';

const nodemailerMock = nodemailer as unknown as {
  createTransport: jest.Mock;
};
const logMock = log as jest.Mock;

describe('EmailService', () => {
  beforeEach(() => {
    logMock.mockReset();
    nodemailerMock.createTransport.mockReset();
  });

  it('queues the test-provider email with an exact log payload and no SMTP transport', async () => {
    const service = new EmailService();
    await expect(
      service.sendResetEmail({
        email: 'user@example.com',
        resetToken: 'token',
        correlationId: '550e8400-e29b-41d4-a716-446655440000',
      }),
    ).resolves.toBeUndefined();

    expect(nodemailerMock.createTransport).not.toHaveBeenCalled();
    expect(logMock).toHaveBeenCalledTimes(1);
    expect(logMock).toHaveBeenCalledWith(
      'info',
      'reset_email_queued_test_provider',
      {
        correlationId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@example.com',
        resetToken: 'token',
        attempt: 1,
      },
    );
  });

  it('exposes the configured retry count', () => {
    expect(config.email.maxRetries).toBe(3);
  });
});
