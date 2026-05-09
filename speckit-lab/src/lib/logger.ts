import crypto from 'crypto';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const currentLevel = (process.env.LOG_LEVEL ?? 'info').toLowerCase();
const order: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const shouldLog = (level: LogLevel): boolean => {
  const configured = (currentLevel in order ? currentLevel : 'info') as LogLevel;
  return order[level] >= order[configured];
};

export interface LogContext {
  correlationId?: string;
  [key: string]: string | number | boolean | null | undefined;
}

/** Creates a correlation id for tracing a single logical request. */
export const createCorrelationId = (): string => crypto.randomUUID();

/** Logs structured JSON for consistent ingestion by observability tools. */
export const log = (level: LogLevel, message: string, context: LogContext = {}): void => {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  process.stdout.write(`${JSON.stringify(payload)}\n`);
};
