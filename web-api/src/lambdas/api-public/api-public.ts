import { app } from '../../app-public';
import { handle } from 'hono/aws-lambda';

export const handler = handle(app);
