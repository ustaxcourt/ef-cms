import {
  FORMATS,
  formatDateString,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { calculateTimeToLive } from '../calculateTimeToLive';
import { put } from '../../dynamodbClientService';

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
  workItem: RawWorkItem;
  userId: string;
}) => {
  const sk = workItem.completedAt ? workItem.completedAt : workItem.updatedAt;
  const ttl = calculateTimeToLive({ numDays: 8, timestamp: sk });

  const promises = [];

  if (ttl.numSeconds > 0) {
    promises.push(
      put({
        Item: {
          ...workItem,
          gsi1pk: `work-item|${workItem.workItemId}`,
          pk: `user-outbox|${userId}`,
          sk,
          ttl: ttl.expirationTimestamp,
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
        pk: `user-outbox|${userId}|${formatDateString(
          sk,
          FORMATS.YEAR,
        )}-w${formatDateString(sk, FORMATS.WEEK)}`,
        sk,
      },
      applicationContext,
    }),
  );

  return Promise.all(promises);
};

export { createUserOutboxRecord };
