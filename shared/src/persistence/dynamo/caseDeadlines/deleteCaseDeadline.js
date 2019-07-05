const client = require('../../dynamodbClientService');

/**
 * deleteCaseDeadline
 *
 * @param caseDeadline
 * @param applicationContext
 * @returns {*}
 */
exports.deleteCaseDeadline = async ({
  applicationContext,
  caseDeadlineId,
  caseId,
}) => {
  const results = [];

  const fullCaseDeadlineId = `case-deadline-${caseDeadlineId}`;

  results.push(
    await client.delete({
      applicationContext,
      key: {
        pk: fullCaseDeadlineId,
        sk: fullCaseDeadlineId,
      },
    }),
  );

  results.push(
    await client.delete({
      applicationContext,
      key: {
        pk: `${caseId}|case-deadline`,
        sk: fullCaseDeadlineId,
      },
    }),
  );

  results.push(
    await client.delete({
      applicationContext,
      key: {
        pk: `case-deadline-catalog`,
        sk: fullCaseDeadlineId,
      },
    }),
  );

  return results;
};
