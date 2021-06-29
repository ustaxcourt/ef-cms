const { put } = require('../../dynamodbClientService');

/**
 * createSectionOutboxRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section
 * @param {object} providers.workItem the work item data
 */
exports.createSectionOutboxRecord = async ({
  applicationContext,
  section,
  workItem,
}) => {
  await put({
    Item: {
      ...workItem,
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `section-outbox|${section}`,
      sk: workItem.completedAt ? workItem.completedAt : workItem.updatedAt,
    },
    applicationContext,
  });
};
