import fs from 'fs/promises';
import path from 'path';
import { dbPool } from '../src/lib/db';

const migrationsDir = path.resolve(process.cwd(), 'db', 'migrations');

const ensureMigrationsTable = async (): Promise<void> => {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
};

const getSqlFiles = async (): Promise<string[]> => {
  const allFiles = await fs.readdir(migrationsDir);
  return allFiles.filter((file) => file.endsWith('.sql')).sort();
};

const getAppliedFiles = async (): Promise<Set<string>> => {
  const result = await dbPool.query<{ filename: string }>('SELECT filename FROM schema_migrations');
  return new Set(result.rows.map((row) => row.filename));
};

const applyUp = async (): Promise<void> => {
  await ensureMigrationsTable();
  const files = await getSqlFiles();
  const applied = await getAppliedFiles();

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    await dbPool.query('BEGIN');
    try {
      await dbPool.query(sql);
      await dbPool.query('INSERT INTO schema_migrations(filename) VALUES($1)', [file]);
      await dbPool.query('COMMIT');
      process.stdout.write(`Applied migration: ${file}\n`);
    } catch (error) {
      await dbPool.query('ROLLBACK');
      throw error;
    }
  }
};

const applyDown = async (): Promise<void> => {
  await ensureMigrationsTable();
  const result = await dbPool.query<{ filename: string }>(
    'SELECT filename FROM schema_migrations ORDER BY id DESC LIMIT 1',
  );

  if (result.rows.length === 0) {
    process.stdout.write('No migrations to roll back.\n');
    return;
  }

  const filename = result.rows[0].filename;
  await dbPool.query('DELETE FROM schema_migrations WHERE filename = $1', [filename]);
  process.stdout.write(`Removed migration marker: ${filename}\n`);
  process.stdout.write(
    'Down migration SQL is not auto-generated. Add explicit rollback scripts if needed.\n',
  );
};

const main = async (): Promise<void> => {
  const direction = process.argv[2] ?? 'up';
  if (direction === 'up') {
    await applyUp();
  } else if (direction === 'down') {
    await applyDown();
  } else {
    throw new Error(`Unsupported direction: ${direction}`);
  }
  await dbPool.end();
};

main().catch((error: unknown) => {
  process.stderr.write(`Migration failed: ${String(error)}\n`);
  process.exit(1);
});
