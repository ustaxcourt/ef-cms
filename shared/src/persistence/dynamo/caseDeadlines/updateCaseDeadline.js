const client = require('../../dynamodbClientService');

/**
 * updateCaseDeadline
 *
 * @param caseDeadlineToUpdate
 * @param applicationContext
 * @returns {*}
 */
exports.updateCaseDeadline = async ({
  applicationContext,
  caseDeadlineToUpdate,
}) => {
  await client.put({
    Item: {
      pk: `case-deadline-${caseDeadlineToUpdate.caseDeadlineId}`,
      sk: `case-deadline-${caseDeadlineToUpdate.caseDeadlineId}`,
      ...caseDeadlineToUpdate,
    },
    applicationContext,
  });
};
