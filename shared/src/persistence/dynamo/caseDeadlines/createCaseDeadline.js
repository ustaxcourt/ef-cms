const client = require('../../dynamodbClientService');
const {
  createCaseDeadlineCatalogRecord,
} = require('./createCaseDeadlineCatalogRecord');
const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');

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

  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber: caseDeadline.docketNumber,
  });

  await client.put({
    Item: {
      pk: `case|${caseId}`,
      sk: `case-deadline|${caseDeadlineId}`,
    },
    applicationContext,
  });

  await createCaseDeadlineCatalogRecord({
    applicationContext,
    caseDeadlineId,
  });
};
