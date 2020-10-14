const client = require('../../dynamodbClientService');

/**
 * deleteCaseDeadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseDeadlineId the id of the case deadline to delete
 * @param {string} providers.docketNumber the docket number of the case the deadline is attached to
 * @returns {Array<Promise>} the promises for the persistence delete calls
 */
exports.deleteCaseDeadline = async ({
  applicationContext,
  caseDeadlineId,
  docketNumber,
}) => {
  const originalCaseDeadline = await client.get({
    Key: {
      pk: `case-deadline|${caseDeadlineId}`,
      sk: `case-deadline|${caseDeadlineId}`,
    },
    applicationContext,
  });

  if (originalCaseDeadline) {
    await Promise.all([
      client.delete({
        applicationContext,
        key: {
          pk: `case-deadline|${caseDeadlineId}`,
          sk: `case-deadline|${caseDeadlineId}`,
        },
      }),
      client.delete({
        applicationContext,
        key: {
          pk: `case|${docketNumber}`,
          sk: `case-deadline|${caseDeadlineId}`,
        },
      }),
      client.delete({
        applicationContext,
        key: {
          pk: originalCaseDeadline.deadlineDate,
          sk: `case-deadline-catalog|${caseDeadlineId}`,
        },
      }),
    ]);
  }
};
