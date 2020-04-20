const client = require('../../dynamodbClientService');

/**
 * updateCaseDeadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadlineToUpdate the case deadline data to update
 */
exports.updateCaseDeadline = async ({
  applicationContext,
  caseDeadlineToUpdate,
}) => {
  await client.put({
    Item: {
      pk: `case-deadline|${caseDeadlineToUpdate.caseDeadlineId}`,
      sk: `case-deadline|${caseDeadlineToUpdate.caseDeadlineId}`,
      ...caseDeadlineToUpdate,
    },
    applicationContext,
  });
};
