import dotenv from 'dotenv';

dotenv.config();

const readRequired = (name: string): string => {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const readNumber = (name: string, fallback: number): number => {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric environment variable: ${name}`);
  }
  return parsed;
};

/** Runtime configuration resolved from environment variables. */
export const config = {
  api: {
    port: readNumber('API_PORT', 3000),
    nodeEnv: process.env.NODE_ENV ?? 'development',
  },
  db: {
    host: readRequired('DB_HOST'),
    port: readNumber('DB_PORT', 5432),
    name: readRequired('DB_NAME'),
    user: readRequired('DB_USER'),
    password: readRequired('DB_PASSWORD'),
    ssl: (process.env.DB_SSL ?? 'false').toLowerCase() === 'true',
  },
  jwt: {
    secret: readRequired('JWT_SECRET'),
    algorithm: process.env.JWT_ALGORITHM ?? 'HS256',
    expiryHours: readNumber('JWT_EXPIRY_HOURS', 24),
  },
  bcrypt: {
    rounds: readNumber('BCRYPT_ROUNDS', 10),
  },
  email: {
    provider: process.env.EMAIL_PROVIDER ?? 'test',
    smtpHost: process.env.SMTP_HOST ?? '',
    smtpPort: readNumber('SMTP_PORT', 587),
    smtpUser: process.env.SMTP_USER ?? '',
    smtpPassword: process.env.SMTP_PASSWORD ?? '',
    from: readRequired('RESET_EMAIL_FROM'),
    maxRetries: 3,
  },
};

export type AppConfig = typeof config;
