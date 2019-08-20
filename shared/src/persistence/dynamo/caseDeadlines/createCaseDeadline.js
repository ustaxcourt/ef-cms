const client = require('../../dynamodbClientService');
const {
  createCaseDeadlineCatalogRecord,
} = require('./createCaseDeadlineCatalogRecord');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');

/**
 * createCaseDeadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadline the case deadline data
 */
exports.createCaseDeadline = async ({ applicationContext, caseDeadline }) => {
  const caseDeadlineId = `case-deadline-${caseDeadline.caseDeadlineId}`;
  await client.put({
    Item: {
      pk: caseDeadlineId,
      sk: caseDeadlineId,
      ...caseDeadline,
    },
    applicationContext,
  });

  await createMappingRecord({
    applicationContext,
    pkId: caseDeadline.caseId,
    skId: caseDeadlineId,
    type: 'case-deadline',
  });

  await createCaseDeadlineCatalogRecord({
    applicationContext,
    caseDeadlineId,
  });
};
