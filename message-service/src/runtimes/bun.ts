import { app } from '@/server';

// eslint-disable-next-line import/no-default-export
export default {
  fetch: app.fetch,
  port: process.env.PORT ?? 1337,
};
