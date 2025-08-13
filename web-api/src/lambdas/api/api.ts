import { app } from '../../app';
import { handle } from 'hono/aws-lambda';

export const handler = handle(app);
