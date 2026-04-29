import { APIGatewayProxyHandler } from 'aws-lambda';
import { app } from '../../app-public';
import awsServerlessExpress from '@codegenie/serverless-express';

export const handler: APIGatewayProxyHandler = (event, context, callback) => {
  return awsServerlessExpress({ app })(event, context, callback);
};
