import {
  type APIGatewayProxyHandler,
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from 'aws-lambda';
import { app } from '../../app-public';
import awsServerlessExpress from '@codegenie/serverless-express';

export const handler: APIGatewayProxyHandler = awsServerlessExpress<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>({
  app,
});
