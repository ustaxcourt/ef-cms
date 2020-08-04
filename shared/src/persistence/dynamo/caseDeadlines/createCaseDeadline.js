const client = require('../../dynamodbClientService');
const {
  createCaseDeadlineCatalogRecord,
} = require('./createCaseDeadlineCatalogRecord');

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
      pk: `case-deadline|${caseDeadlineId}`,
      sk: `case-deadline|${caseDeadlineId}`,
      ...caseDeadline,
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

  await createCaseDeadlineCatalogRecord({
    applicationContext,
    caseDeadlineId,
  });
};
