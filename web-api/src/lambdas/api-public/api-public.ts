import { app } from '../../app-public';
import awsServerlessExpress from '@vendia/serverless-express';

export const handler = awsServerlessExpress({ app });
