process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_NAME = process.env.DB_NAME ?? 'auth_dev';
process.env.DB_USER = process.env.DB_USER ?? 'auth_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'dev_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.RESET_EMAIL_FROM = process.env.RESET_EMAIL_FROM ?? 'noreply@example.com';

describe('EmailService SMTP branch', () => {
  it('creates an SMTP transport and sends mail when provider is smtp', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock('../../src/lib/config', () => ({
        config: {
          email: {
            provider: 'smtp',
            smtpHost: 'smtp.example.com',
            smtpPort: 2525,
            smtpUser: 'smtp-user',
            smtpPassword: 'smtp-pass',
            from: 'noreply@example.com',
            maxRetries: 3,
          },
        },
      }));

      const sendMail = jest.fn().mockResolvedValue(undefined);
      jest.doMock('nodemailer', () => ({
        __esModule: true,
        default: {
          createTransport: jest.fn(() => ({ sendMail })),
        },
      }));

      jest.doMock('../../src/lib/logger', () => ({
        log: jest.fn(),
      }));

      const nodemailerModule = (await import('nodemailer')).default as unknown as {
        createTransport: jest.Mock;
      };
      const { EmailService } = await import('../../src/services/EmailService');
      const service = new EmailService();

      expect(nodemailerModule.createTransport).toHaveBeenCalledWith({
        host: 'smtp.example.com',
        port: 2525,
        auth: {
          user: 'smtp-user',
          pass: 'smtp-pass',
        },
      });

      await expect(
        service.sendResetEmail({
          email: 'user@example.com',
          resetToken: 'token',
          correlationId: '550e8400-e29b-41d4-a716-446655440100',
        }),
      ).resolves.toBeUndefined();

      expect(sendMail).toHaveBeenCalledTimes(1);
      expect(sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@example.com',
          to: 'user@example.com',
          subject: 'Reset your password',
        }),
      );
    });
  });

  it('retries SMTP failures exactly three times and surfaces the last error', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock('../../src/lib/config', () => ({
        config: {
          email: {
            provider: 'smtp',
            smtpHost: 'smtp.example.com',
            smtpPort: 2525,
            smtpUser: 'smtp-user',
            smtpPassword: 'smtp-pass',
            from: 'noreply@example.com',
            maxRetries: 3,
          },
        },
      }));

      const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation(
        ((callback: any) => {
          if (typeof callback === 'function') {
            callback();
          }
          return 0 as unknown as NodeJS.Timeout;
        }) as typeof setTimeout,
      );

      const sendMail = jest.fn().mockRejectedValue(new Error('smtp down'));
      jest.doMock('nodemailer', () => ({
        __esModule: true,
        default: {
          createTransport: jest.fn(() => ({ sendMail })),
        },
      }));

      jest.doMock('../../src/lib/logger', () => ({
        log: jest.fn(),
      }));

      const { EmailService } = await import('../../src/services/EmailService');
      const service = new EmailService();

      await expect(
        service.sendResetEmail({
          email: 'user@example.com',
          resetToken: 'token',
          correlationId: '550e8400-e29b-41d4-a716-446655440101',
        }),
      ).rejects.toThrow('smtp down');

      expect(sendMail).toHaveBeenCalledTimes(3);
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(1, expect.any(Function), 200);
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(2, expect.any(Function), 400);

      setTimeoutSpy.mockRestore();
    });
  });

  it('throws when smtp transport cannot be created', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock('../../src/lib/config', () => ({
        config: {
          email: {
            provider: 'smtp',
            smtpHost: 'smtp.example.com',
            smtpPort: 2525,
            smtpUser: '',
            smtpPassword: '',
            from: 'noreply@example.com',
            maxRetries: 3,
          },
        },
      }));

      jest.doMock('nodemailer', () => ({
        __esModule: true,
        default: {
          createTransport: jest.fn(() => null),
        },
      }));

      jest.doMock('../../src/lib/logger', () => ({
        log: jest.fn(),
      }));

      const { EmailService } = await import('../../src/services/EmailService');
      const service = new EmailService();

      await expect(
        service.sendResetEmail({
          email: 'user@example.com',
          resetToken: 'token',
          correlationId: '550e8400-e29b-41d4-a716-446655440101',
        }),
      ).rejects.toThrow('SMTP transporter is not configured');
    });
  });
});