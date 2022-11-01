import { put } from '../../dynamodbClientService';

const TIME_TO_EXIST = 60 * 60 * 24;

/**
 * saveUserConnection
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.connectionId the websocket connection id
 * @param {string} providers.endpoint the websocket endpoint url
 * @param {string} providers.userId the user id
 * @returns {Promise} the promise of the call to persistence
 */
export const saveUserConnection = ({
  applicationContext,
  clientConnectionId,
  connectionId,
  endpoint,
  userId,
}: {
  applicationContext: IApplicationContext;
  clientConnectionId: string;
  connectionId: string;
  endpoint: string;
  userId: string;
}) =>
  Promise.all([
    put({
      Item: {
        clientConnectionId,
        connectionId,
        endpoint,
        gsi1pk: 'connection',
        pk: `user|${userId}`,
        sk: `connection|${connectionId}`,
        ttl: Math.floor(Date.now() / 1000) + TIME_TO_EXIST,
        userId,
      },
      applicationContext,
    }),
    put({
      Item: {
        clientConnectionId,
        connectionId,
        endpoint,
        pk: `connection|${connectionId}`,
        sk: `connection|${connectionId}`,
        ttl: Math.floor(Date.now() / 1000) + TIME_TO_EXIST,
        userId,
      },
      applicationContext,
    }),
  ]);
