import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN_API,
  environment: process.env.STAGE!,
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

export async function captureException(error: Error) {
  if (process.env.IS_LOCAL) return;
  Sentry.captureException(error);
  await Sentry.flush();
}
