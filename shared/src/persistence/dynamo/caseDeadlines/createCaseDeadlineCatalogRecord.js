const { put } = require('../../dynamodbClientService');

/**
 * createCaseDeadlineCatalogRecord
 *
 * @param caseDeadlineId
 * @param applicationContext
 * @returns {*}
 */
exports.createCaseDeadlineCatalogRecord = async ({
  applicationContext,
  caseDeadlineId,
}) => {
  await put({
    Item: {
      caseDeadlineId,
      pk: `case-deadline-catalog`,
      sk: caseDeadlineId,
    },
    applicationContext,
  });
};
