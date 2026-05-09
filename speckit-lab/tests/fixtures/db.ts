export const testDbConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? 'auth_dev',
  user: process.env.DB_USER ?? 'auth_user',
  password: process.env.DB_PASSWORD ?? 'dev_password',
};
