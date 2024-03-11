import { connectLambda } from '../../../src/lambdas/notifications/connectLambda';
import { defaultLambda } from '../../../src/lambdas/notifications/defaultLambda';
import { disconnectLambda } from '../../../src/lambdas/notifications/disconnectLambda';

export const connectHandler = connectLambda;
export const disconnectHandler = disconnectLambda;
export const defaultHandler = defaultLambda;
