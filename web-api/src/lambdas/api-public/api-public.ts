import { app } from '../../app-public';
import awsServerlessExpress from '@codegenie/serverless-express';

export const handler = (event, context) => {
  // @ts-ignore
  return awsServerlessExpress({ app })(event, context);
};
