import nodemailer from 'nodemailer';
import { config } from '../lib/config';
import { log } from '../lib/logger';

export interface ResetEmailPayload {
  email: string;
  resetToken: string;
  correlationId: string;
}

/** Handles email delivery with retry semantics for reset flows. */
export class EmailService {
  private readonly transporter =
    config.email.provider === 'smtp'
      ? nodemailer.createTransport({
          host: config.email.smtpHost,
          port: config.email.smtpPort,
          auth:
            config.email.smtpUser && config.email.smtpPassword
              ? {
                  user: config.email.smtpUser,
                  pass: config.email.smtpPassword,
                }
              : undefined,
        })
      : null;

  /** Sends reset email with up to configured retry attempts and backoff. */
  public async sendResetEmail(payload: ResetEmailPayload): Promise<void> {
    const maxRetries = config.email.maxRetries;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt += 1;
      try {
        if (config.email.provider === 'test') {
          log('info', 'reset_email_queued_test_provider', {
            correlationId: payload.correlationId,
            email: payload.email,
            resetToken: payload.resetToken,
            attempt,
          });
          return;
        }

        if (!this.transporter) {
          throw new Error('SMTP transporter is not configured');
        }

        await this.transporter.sendMail({
          from: config.email.from,
          to: payload.email,
          subject: 'Reset your password',
          text: `Use this reset token within 15 minutes: ${payload.resetToken}`,
        });

        log('info', 'reset_email_sent', {
          correlationId: payload.correlationId,
          email: payload.email,
          attempt,
        });
        return;
      } catch (error) {
        log('warn', 'reset_email_send_failed', {
          correlationId: payload.correlationId,
          email: payload.email,
          attempt,
          error: String(error),
        });
        if (attempt >= maxRetries) {
          throw error;
        }
        await new Promise<void>((resolve) => {
          setTimeout(resolve, attempt * 200);
        });
      }
    }
  }
}
