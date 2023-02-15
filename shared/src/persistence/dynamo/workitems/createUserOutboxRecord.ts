import {
  FORMATS,
  formatDateString,
} from '../../../business/utilities/DateHandler';
import { put } from '../../dynamodbClientService';

const TIME_TO_EXIST = 60 * 60 * 24 * 8; // 8 days

/**
 * Calculate the start of the this day, and then add on `TIME_TO_EXIST` to determine
 * how long the record should last on the `user-outbox|${userId}` primary key
 *
 * @returns {Number} Number of seconds since the epoch for when we want this record to expire
 */
const calculateTimeToLive = () => {
  const now = Math.floor(Date.now() / 1000);
  return now - (now % 86400) + TIME_TO_EXIST;
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
}) =>
  Promise.all([
    put({
      Item: {
        ...workItem,
        gsi1pk: `work-item|${workItem.workItemId}`,
        pk: `user-outbox|${userId}`,
        sk: workItem.completedAt ? workItem.completedAt : workItem.updatedAt,
        ttl: calculateTimeToLive(),
      },
      applicationContext,
    }),
    put({
      Item: {
        ...workItem,
        gsi1pk: `work-item|${workItem.workItemId}`,
        pk: `user-outbox|${userId}|${formatDateString(
          workItem.completedAt,
          FORMATS.YYYYMMDD,
        )}`,
        sk: workItem.completedAt ? workItem.completedAt : workItem.updatedAt,
      },
      applicationContext,
    }),
  ]);

export { TIME_TO_EXIST, createUserOutboxRecord };
