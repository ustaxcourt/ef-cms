import { connectLambda } from '../notifications/connectLambda';
import { defaultLambda } from '../notifications/defaultLambda';
import { disconnectLambda } from '../notifications/disconnectLambda';

export const connectHandler = connectLambda;
export const disconnectHandler = disconnectLambda;
export const defaultHandler = defaultLambda;
