import {
  FORMATS,
  formatDateString,
} from '../../../business/utilities/DateHandler';
import { calculateTimeToLive } from './calculateTimeToLive';
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
  Item: TOutboxItem & TDynamoRecord;
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
 * @returns {Promise} resolves upon completion of persistence request
 */
const createSectionOutboxRecentRecord = ({
  applicationContext,
  Item,
  section,
}: {
  applicationContext: IApplicationContext;
  Item: TOutboxItem & TDynamoRecord;
  section: string;
}) =>
  put({
    Item: {
      ...Item,
      pk: `section-outbox|${section}`,
      ttl: calculateTimeToLive(Item.sk),
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
  workItem: TOutboxItem;
}) => {
  const sk = workItem.completedAt
    ? workItem.completedAt
    : (workItem as any).updatedAt;
  const Item: any = {
    ...workItem,
    gsi1pk: `work-item|${workItem.workItemId}`,
    sk,
  };
  const ttl = calculateTimeToLive(sk);
  const promises = [];
  if (ttl > 0) {
    promises.push(
      createSectionOutboxRecentRecord({
        Item,
        applicationContext,
        section,
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
