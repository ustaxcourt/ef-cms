import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
});
