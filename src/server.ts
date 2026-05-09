import { app } from './app';
import { config } from './lib/config';
import { healthCheckDb } from './lib/db';
import { log } from './lib/logger';

const start = async (): Promise<void> => {
  const dbHealthy = await healthCheckDb();
  if (!dbHealthy) {
    throw new Error('database_unavailable');
  }

  app.listen(config.api.port, () => {
    log('info', 'server_started', { port: config.api.port });
  });
};

start().catch((error: unknown) => {
  log('error', 'server_start_failed', { error: String(error) });
  process.exit(1);
});
