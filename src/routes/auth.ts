import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { AuthService } from '../services/AuthService';
import { CryptoService } from '../services/CryptoService';
import { EmailService } from '../services/EmailService';
import { PasswordResetService } from '../services/PasswordResetService';
import { SessionManager } from '../services/SessionManager';

const router = Router();

const cryptoService = new CryptoService();
const sessionManager = new SessionManager();
const authService = new AuthService(cryptoService, sessionManager);
const emailService = new EmailService();
const passwordResetService = new PasswordResetService(
  cryptoService,
  emailService,
  authService,
  sessionManager,
);

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      throw new Error('invalid_input');
    }

    const user = await authService.registerUser(email, password, req.correlationId);
    res.status(201).json({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      throw new Error('invalid_input');
    }

    const response = await authService.loginUser({
      email,
      password,
      ipAddress: req.ip,
      userAgent: req.header('user-agent') ?? null,
      correlationId: req.correlationId,
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    if (!req.auth) {
      throw new Error('unauthorized');
    }

    await authService.logoutUser(req.auth.jti, req.auth.userId, req.correlationId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/request-reset', async (req, res, next) => {
  try {
    const { email } = req.body as { email?: string };
    if (!email) {
      throw new Error('invalid_input');
    }

    await passwordResetService.requestReset(email, req.correlationId);
    res.status(202).json({
      message: 'If an account exists with this email, a reset link will be sent.',
      status: 'pending',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { reset_token: resetToken, new_password: newPassword } = req.body as {
      reset_token?: string;
      new_password?: string;
    };

    if (!resetToken || !newPassword) {
      throw new Error('invalid_input');
    }

    const result = await passwordResetService.completeReset(
      resetToken,
      newPassword,
      req.correlationId,
    );

    res.status(200).json({
      message: 'Password successfully reset. Please log in with your new password.',
      user_id: result.userId,
    });
  } catch (error) {
    next(error);
  }
});

export { router as authRouter };
