import {
  FORMATS,
  formatDateString,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { RawOutboxItem } from '@shared/business/entities/OutboxItem';
import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { TDynamoRecord } from '../dynamoTypes';
import { calculateTimeToLive } from '../calculateTimeToLive';
import { put } from '../../dynamodbClientService';

/**
 * Create the record for the long term archive, broken out into its own partition based on the year, month and day
 *
 * @param {Object} providers The providers object
 * @param {Object} providers.applicationContext The application context
 * @param {String} section docket or petitions
 * @param {WorkItem} workItem The instantiated Work Item to create a record
 * @returns {Promise} resolves upon completion of persistence request
 */
const createSectionOutboxArchiveRecord = async ({
  applicationContext,
  Item,
  section,
}: {
  applicationContext: IApplicationContext;
  Item: RawOutboxItem & TDynamoRecord;
  section: string;
}) => {
  const skMonthDay = formatDateString(Item.sk, FORMATS.YYYYMMDD);

  await put({
    Item: {
      ...Item,
      pk: `section-outbox|${section}|${skMonthDay}`,
    },
    applicationContext,
  });
};

/**
 * Create the record that is used to show the last seven days of a section's outbox
 *
 * @param {Object} providers The providers object
 * @param {Object} providers.applicationContext The application context
 * @param {Object} providers.Item The base object that gets stored in persistence
 * @param {String} providers.section docket or petitions
 * @param {Number} providers.ttl the timestamp when this record expires
 * @returns {Promise} resolves upon completion of persistence request
 */
const createSectionOutboxRecentRecord = ({
  applicationContext,
  Item,
  section,
  ttl,
}: {
  applicationContext: IApplicationContext;
  Item: RawOutboxItem & TDynamoRecord;
  section: string;
  ttl: number;
}) =>
  put({
    Item: {
      ...Item,
      pk: `section-outbox|${section}`,
      ttl,
    },
    applicationContext,
  });

/**
 * createSectionOutboxRecords
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section
 * @param {object} providers.workItem the work item data
 * @returns {Promise} resolves upon completion of persistence requests
 */
const createSectionOutboxRecords = ({
  applicationContext,
  section,
  workItem,
}: {
  applicationContext: IApplicationContext;
  section: string;
  workItem: RawWorkItem;
}) => {
  const sk = workItem.completedAt
    ? workItem.completedAt
    : (workItem as any).updatedAt;
  const Item: any = {
    ...workItem,
    gsi1pk: `work-item|${workItem.workItemId}`,
    sk,
  };
  const promises = [];
  const ttl = calculateTimeToLive({ numDays: 8, timestamp: sk });

  if (ttl.numSeconds > 0) {
    promises.push(
      createSectionOutboxRecentRecord({
        Item,
        applicationContext,
        section,
        ttl: ttl.expirationTimestamp,
      }),
    );
  }

  promises.push(
    createSectionOutboxArchiveRecord({
      Item,
      applicationContext,
      section,
    }),
  );
  return Promise.all(promises);
};

export { createSectionOutboxRecords };
