import { queryFull } from '../../dynamodbClientService';

/**
 * getAllWebSocketConnections
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise} the promise of the call to persistence
 */
export const getAllWebSocketConnections = ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}) =>
  queryFull({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': 'connection',
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  }) as Promise<TConnection[]>;
