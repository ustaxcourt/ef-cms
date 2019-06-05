const { put } = require('../../dynamodbClientService');

/**
 * createCaseCatalogRecord
 *
 * @param caseId
 * @param applicationContext
 * @returns {*}
 */
exports.createCaseCatalogRecord = async ({ caseId, applicationContext }) => {
  await put({
    Item: {
      caseId,
      pk: `catalog`,
      sk: `case-${caseId}`,
    },
    applicationContext,
  });
};
