import {
  FORMATS,
  createISODateString,
  dateStringsCompared,
  formatDateString,
  subtractISODates,
} from '../../../business/utilities/DateHandler';
import { put } from '../../dynamodbClientService';

/**
 * Calculate the 8 days from the provided timestamp
 *
 * @returns {Number} Number of seconds since the epoch forFORMATS when we want this record to expire
 */
const calculateTimeToLive = timestamp => {
  // get mills of 8 days ago
  const eightDaysAgo = subtractISODates(createISODateString(), {
    day: 8,
  });
  return dateStringsCompared(timestamp, eightDaysAgo);
};

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

export { calculateTimeToLive, createUserOutboxRecord };
