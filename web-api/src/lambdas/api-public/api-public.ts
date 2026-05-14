import { app } from '../../app-public';
import awsServerlessExpress from '@codegenie/serverless-express';
import type {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';

export const handler: APIGatewayProxyHandler = awsServerlessExpress<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>({
  app,
});
