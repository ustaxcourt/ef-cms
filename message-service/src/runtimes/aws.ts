import {} from 'sst';
import { app } from '../server';
import { handle } from 'hono/aws-lambda';
export const handler = handle(app);
