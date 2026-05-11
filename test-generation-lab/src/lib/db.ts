import { Pool } from 'pg';
import { config } from './config';

export const dbPool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
  max: 10,
});

/** Performs a lightweight database health check query. */
export const healthCheckDb = async (): Promise<boolean> => {
  const client = await dbPool.connect();
  try {
    await client.query('SELECT 1');
    return true;
  } finally {
    client.release();
  }
};
