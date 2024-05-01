import * as Sentry from '@sentry/node';

if (process.env.ENABLE_SENTRY !== 'true') {
  Sentry.init({
    beforeSend(event, hint) {
      const error = hint.originalException as Error & { skipLogging?: boolean };
      if (error && error.skipLogging) return null;
      return event;
    },
    dsn: process.env.SENTRY_DSN_API,
    environment: process.env.STAGE!,
    profilesSampleRate: 1.0,
    release: process.env.COMMIT_SHA,
    tracesSampleRate: 1.0,
  });
}

export async function captureException(error: Error) {
  if (process.env.IS_LOCAL) return;
  if (process.env.ENABLE_SENTRY !== 'true') return;
  Sentry.captureException(error);
  await Sentry.flush();
}

export function setUser({
  ip,
  name,
  userId,
}: {
  userId: string;
  ip: string;
  name: string;
}) {
  if (process.env.ENABLE_SENTRY !== 'true') return;
  Sentry.setUser({
    id: userId,
    ip_address: ip,
    username: name,
  });
}
