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
 * @param caseDeadline
 * @param applicationContext
 * @returns {*}
 */
exports.createCaseDeadline = async ({ applicationContext, caseDeadline }) => {
  await client.put({
    Item: {
      pk: `case-deadline-${caseDeadline.caseDeadlineId}`,
      sk: `case-deadline-${caseDeadline.caseDeadlineId}`,
      ...caseDeadline,
    },
    applicationContext,
  });

  await createMappingRecord({
    applicationContext,
    pkId: caseDeadline.caseId,
    skId: caseDeadline.caseDeadlineId,
    type: 'case-deadline',
  });

  await createCaseDeadlineCatalogRecord({
    applicationContext,
    pkId: caseDeadline.caseId,
    skId: caseDeadline.caseDeadlineId,
    type: 'case-deadline',
  });
};
