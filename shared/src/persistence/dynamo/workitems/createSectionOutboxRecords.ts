const {
  formatDateString,
  FORMATS,
} = require('../../../business/utilities/DateHandler');
const { put } = require('../../dynamodbClientService');
const TIME_TO_EXIST = 60 * 60 * 24 * 8; // 8 days

/**
 * Calculate the start of the this day, and then add on `TIME_TO_EXIST` to determine
 * how long the record should last on the `work-item|${section}` partition
 *
 * @returns {Number} Number of seconds since the epoch for when we want this record to expire
 */
const calculateTimeToLive = () => {
  const now = Math.floor(Date.now() / 1000);
  return now - (now % 86400) + TIME_TO_EXIST;
};

/**
 * Create the record for the long term archive, broken out into its own partition based on the month
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
}) => {
  const skMonth = formatDateString(Item.sk, FORMATS.YYYYMM);

  await put({
    Item: {
      ...Item,
      pk: `section-outbox|${section}|${skMonth}`,
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
}) =>
  put({
    Item: {
      ...Item,
      pk: `section-outbox|${section}`,
      ttl: calculateTimeToLive(),
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
}) => {
  const Item = {
    ...workItem,
    gsi1pk: `work-item|${workItem.workItemId}`,
    sk: workItem.completedAt ? workItem.completedAt : workItem.updatedAt,
  };

  return Promise.all([
    createSectionOutboxRecentRecord({
      Item,
      applicationContext,
      section,
    }),
    createSectionOutboxArchiveRecord({
      Item,
      applicationContext,
      section,
    }),
  ]);
};

module.exports = {
  TIME_TO_EXIST,
  createSectionOutboxRecords,
};
