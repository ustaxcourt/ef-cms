import {
  getFromDeployTable,
  remove,
  updateConsistent,
} from '../../dynamodbClientService';

/**
 * getLimiterByKey
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key for retrieving the correct rate limiter
 * @returns {Promise<object>} an object containing the value of maxInvocations and windowTime
 */
export const getLimiterByKey = async ({ applicationContext, key }) => {
  const result = await getFromDeployTable({
    Key: {
      pk: key,
      sk: key,
    },
    applicationContext,
  });

  return result;
};

/**
 * incrementKeyCount
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the item to increment
 * @returns {Promise} the promise of the call to persistence
 */
export const incrementKeyCount = ({ applicationContext, key }) =>
  updateConsistent({
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':value': 1,
    },
    Key: {
      pk: `${key}`,
      sk: `${key}`,
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: 'ADD #id :value',
    applicationContext,
  });

/**
 * setExpiresAt
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the item to increment
 * @param {string} providers.expiresAt the expiresAt of the item
 * @returns {Promise} the promise of the call to persistence
 */
export const setExpiresAt = ({
  applicationContext,
  expiresAt,
  key,
}: {
  applicationContext: IApplicationContext;
  expiresAt: string;
  key: string;
}) =>
  updateConsistent({
    ExpressionAttributeNames: {
      '#expiresAt': 'expiresAt',
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': 1,
      ':value': expiresAt,
    },
    Key: {
      pk: `${key}`,
      sk: `${key}`,
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: 'SET #expiresAt = :value, #id = :id',
    applicationContext,
  });

export const deleteKeyCount = ({ applicationContext, key }) =>
  remove({ applicationContext, key: { pk: key, sk: key } });
