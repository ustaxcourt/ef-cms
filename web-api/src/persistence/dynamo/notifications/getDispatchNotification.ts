import { query } from '../../dynamodbClientService';

/**
 * getDispatchNotification
 *
 * Uses a filter to retrieve only the information where `ttl` is greater than currentEpoch;
 * AWS doesn't remove those records for 24-48 hours after ttl has expired
 *
 * @param {object} providers The providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.topic the topic of the dispatch being sent
 * @returns {array} an array of the results returned by the query
 */
export const getDispatchNotification = ({
  applicationContext,
  topic,
}: {
  applicationContext: IApplicationContext;
  topic: string;
}) =>
  query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
      '#ttl': 'ttl',
    },
    ExpressionAttributeValues: {
      ':currentEpoch': Date.now() / 1000, // time to live
      ':pk': 'dispatch-notification',
      ':sk': topic,
    },
    FilterExpression: '#ttl >= :currentEpoch',
    KeyConditionExpression: '#pk = :pk AND #sk = :sk',
    applicationContext,
  });
