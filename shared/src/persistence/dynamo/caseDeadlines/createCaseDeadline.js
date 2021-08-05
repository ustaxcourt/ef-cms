const client = require('../../dynamodbClientService');

/**
 * createCaseDeadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadline the case deadline data
 */
exports.createCaseDeadline = ({ applicationContext, caseDeadline }) => {
  const { caseDeadlineId, docketNumber } = caseDeadline;
  return Promise.all([
    client.put({
      Item: {
        ...caseDeadline,
        pk: `case-deadline|${caseDeadlineId}`,
        sk: `case-deadline|${caseDeadlineId}`,
      },
      applicationContext,
    }),
    client.put({
      Item: {
        pk: `case|${docketNumber}`,
        sk: `case-deadline|${caseDeadlineId}`,
      },
      applicationContext,
    }),
  ]);
};
