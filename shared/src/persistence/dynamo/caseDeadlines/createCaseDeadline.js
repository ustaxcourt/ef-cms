const client = require('../../dynamodbClientService');

/**
 * createCaseDeadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadline the case deadline data
 */
exports.createCaseDeadline = async ({ applicationContext, caseDeadline }) => {
  const { caseDeadlineId } = caseDeadline;
  await client.put({
    Item: {
      ...caseDeadline,
      pk: `case-deadline|${caseDeadlineId}`,
      sk: `case-deadline|${caseDeadlineId}`,
    },
    applicationContext,
  });

  await client.put({
    Item: {
      pk: `case|${caseDeadline.docketNumber}`,
      sk: `case-deadline|${caseDeadlineId}`,
    },
    applicationContext,
  });
};
