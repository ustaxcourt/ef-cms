import { app } from '../../../src/app-public';
import awsServerlessExpress from '@vendia/serverless-express';

export const handler = awsServerlessExpress({ app });
