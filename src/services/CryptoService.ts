import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../lib/config';
import { AuthTokenPayload } from '../lib/types';

/** Provides cryptographic operations for password and token handling. */
export class CryptoService {
  /** Hashes a plaintext password using bcrypt rounds from configuration. */
  public async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, config.bcrypt.rounds);
  }

  /** Compares a plaintext password against a stored bcrypt hash. */
  public async verifyPassword(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }

  /** Creates a signed JWT token with 24-hour expiration by default. */
  public signJwt(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.jwt.secret, {
      algorithm: config.jwt.algorithm as jwt.Algorithm,
      expiresIn: `${config.jwt.expiryHours}h`,
    });
  }

  /** Verifies a JWT and returns typed token payload. */
  public verifyJwt(token: string): AuthTokenPayload {
    return jwt.verify(token, config.jwt.secret, {
      algorithms: [config.jwt.algorithm as jwt.Algorithm],
    }) as AuthTokenPayload;
  }

  /** Produces a stable SHA-256 hash for storage of tokens. */
  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /** Generates a secure random token for password reset links. */
  public generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /** Generates a unique JWT ID for session tracking and revocation. */
  public generateJti(): string {
    return crypto.randomUUID();
  }
}
