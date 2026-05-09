import { NextFunction, Request, Response } from 'express';
import { CryptoService } from '../services/CryptoService';
import { SessionManager } from '../services/SessionManager';

const cryptoService = new CryptoService();
const sessionManager = new SessionManager();

/** Validates bearer token signature and active server-side session status. */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const header = req.header('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    next(new Error('unauthorized'));
    return;
  }

  const token = header.replace('Bearer ', '').trim();

  try {
    const payload = cryptoService.verifyJwt(token);
    const activeSession = await sessionManager.validateSession(payload.jti);
    if (!activeSession) {
      throw new Error('unauthorized');
    }

    req.auth = {
      userId: Number(payload.sub),
      jti: payload.jti,
      email: payload.email,
    };
    next();
  } catch {
    next(new Error('unauthorized'));
  }
};
