import * as Sentry from '@sentry/serverless';
import { app } from '../../../src/app';
import awsServerlessExpress from '@vendia/serverless-express';

Sentry.AWSLambda.init({
  dsn: process.env.SENTRY_DSN_API,
  environment: process.env.STAGE!,
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

export const handler = Sentry.AWSLambda.wrapHandler(
  async (event: any, context: any) => {
    // This hack is added because serverless-express doesn't seem to work with lambda proxy integrations.
    // Without this, the deployed /auth endpoint has to be reached via /auth/auth/*
    // Bug Detail: https://github.com/vendia/serverless-express/issues/400
    if (event.path && event.path.startsWith('/auth')) {
      // awsServerlessExpress will expect this to be set correctly: event.pathParameters.proxy
      event.pathParameters.proxy = `auth/${event.pathParameters.proxy}`;
    }

    // This is a hack needed for when we use async api gateway events.  Normal api gateway requests
    // will send event.body as a string, but for async events with the X-Amz-Invocation-Type header,
    // this will be an object which causes serverless-express to crash.
    event.body =
      typeof event.body === 'string' ? event.body : JSON.stringify(event.body);
    return awsServerlessExpress({
      app,
    })(event, context);
  },
);
