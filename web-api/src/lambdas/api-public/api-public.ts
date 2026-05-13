import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { app } from '../../app-public';
import awsServerlessExpress from '@codegenie/serverless-express';

export const handler = async (
  event: APIGatewayProxyEvent,
  context: any,
): Promise<APIGatewayProxyResult> => {
  return (
    awsServerlessExpress({ app }) as unknown as (
      event: APIGatewayProxyEvent,
      context: any,
    ) => Promise<APIGatewayProxyResult>
  )(event, context);
};
