import { defineConfig } from 'drizzle-kit';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
});
