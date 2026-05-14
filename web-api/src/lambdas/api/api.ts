import { app } from '../../app';
import awsServerlessExpress from '@codegenie/serverless-express';
import type {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';

const serverlessExpressHandler: APIGatewayProxyHandler = awsServerlessExpress<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>({
  app,
});

export const handler: APIGatewayProxyHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>,
): Promise<APIGatewayProxyResult> | void => {
  // This hack is added because serverless-express doesn't seem to work with lambda proxy integrations.
  // Without this, the deployed /auth endpoint has to be reached via /auth/auth/*
  // Bug Detail: https://github.com/vendia/serverless-express/issues/400
  if (event.path && event.path.startsWith('/auth') && event.pathParameters) {
    // awsServerlessExpress will expect this to be set correctly: event.pathParameters.proxy
    event.pathParameters.proxy = `auth/${event.pathParameters.proxy}`;
  }
  if (event.path && event.path.startsWith('/system') && event.pathParameters) {
    // awsServerlessExpress will expect this to be set correctly: event.pathParameters.proxy
    event.pathParameters.proxy = `system/${event.pathParameters.proxy}`;
  }

  // This is a hack needed for when we use async api gateway events.  Normal api gateway requests
  // will send event.body as a string, but for async events with the X-Amz-Invocation-Type header,
  // this will be an object which causes serverless-express to crash.
  event.body =
    typeof event.body === 'string' ? event.body : JSON.stringify(event.body);

  return serverlessExpressHandler(event, context, callback);
};
