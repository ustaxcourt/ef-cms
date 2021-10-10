const {
  FORMATS,
  prepareDateFromString,
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
 * createSectionOutboxRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section
 * @param {object} providers.workItem the work item data
 * @returns {Promise} resolves upon completion of persistence request
 */
const createSectionOutboxRecord = async ({
  applicationContext,
  section,
  workItem,
}) => {
  const sk = workItem.completedAt ? workItem.completedAt : workItem.updatedAt;
  const skMonth = prepareDateFromString(sk).format(FORMATS.YYYY_MM);
  const ttl = calculateTimeToLive();

  await put({
    Item: {
      ...workItem,
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `section-outbox|${section}`,
      sk,
      ttl,
    },
    applicationContext,
  });
  await put({
    Item: {
      ...workItem,
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `section-outbox|${section}|${skMonth}`,
      sk: workItem.completedAt ? workItem.completedAt : workItem.updatedAt,
    },
    applicationContext,
  });
};

module.exports = {
  TIME_TO_EXIST,
  createSectionOutboxRecord,
};
