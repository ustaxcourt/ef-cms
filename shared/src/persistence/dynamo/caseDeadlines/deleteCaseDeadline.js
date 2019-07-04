const client = require('../../dynamodbClientService');

/**
 * deleteCaseDeadline
 *
 * @param caseDeadline
 * @param applicationContext
 * @returns {*}
 */
exports.deleteCaseDeadline = async ({ applicationContext, caseDeadline }) => {
  const results = [];

  results.push(
    await client.delete({
      applicationContext,
      key: {
        pk: `case-deadline-${caseDeadline.caseDeadlineId}`,
        sk: `case-deadline-${caseDeadline.caseDeadlineId}`,
      },
    }),
  );

  results.push(
    await client.delete({
      applicationContext,
      key: {
        pk: `${caseDeadline.caseId}|case-deadline`,
        sk: `case-deadline-${caseDeadline.caseDeadlineId}`,
      },
    }),
  );

  results.push(
    await client.delete({
      applicationContext,
      key: {
        pk: `case-deadline-catalog`,
        sk: `case-deadline-${caseDeadline.caseDeadlineId}`,
      },
    }),
  );

  return results;
};
