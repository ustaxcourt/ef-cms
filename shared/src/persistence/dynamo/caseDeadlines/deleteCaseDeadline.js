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
  const results = [];

  results.push(
    await client.delete({
      applicationContext,
      key: {
        pk: `case-deadline|${caseDeadlineId}`,
        sk: `case-deadline|${caseDeadlineId}`,
      },
    }),
  );

  results.push(
    await client.delete({
      applicationContext,
      key: {
        pk: `case|${docketNumber}`,
        sk: `case-deadline|${caseDeadlineId}`,
      },
    }),
  );

  results.push(
    await client.delete({
      applicationContext,
      key: {
        pk: 'case-deadline-catalog',
        sk: `case-deadline|${caseDeadlineId}`,
      },
    }),
  );

  return results;
};
