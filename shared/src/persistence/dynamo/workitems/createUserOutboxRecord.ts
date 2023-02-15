import {
  FORMATS,
  formatDateString,
} from '../../../business/utilities/DateHandler';
import { put } from '../../dynamodbClientService';
const { calculateTimeToLive } = require('./calculateTimeToLive');

/**
 * createUserOutboxRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user id to create the record for
 * @param {object} providers.workItem the work item data
 * @returns {Promise} resolves upon completion of persistence request
 */
const createUserOutboxRecord = ({
  applicationContext,
  userId,
  workItem,
}: {
  applicationContext: IApplicationContext;
  workItem: TOutboxItem;
  userId: string;
}) => {
  const sk = workItem.completedAt ? workItem.completedAt : workItem.updatedAt;
  const ttl = calculateTimeToLive(sk);

  const promises = [];

  if (ttl > 0) {
    promises.push(
      put({
        Item: {
          ...workItem,
          gsi1pk: `work-item|${workItem.workItemId}`,
          pk: `user-outbox|${userId}`,
          sk,
          ttl,
        },
        applicationContext,
      }),
    );
  }

  promises.push(
    put({
      Item: {
        ...workItem,
        gsi1pk: `work-item|${workItem.workItemId}`,
        pk: `user-outbox|${userId}|${formatDateString(sk, FORMATS.YYYYMMDD)}`,
        sk,
      },
      applicationContext,
    }),
  );

  return Promise.all(promises);
};

export { createUserOutboxRecord };
