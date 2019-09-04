const { put } = require('../../dynamodbClientService');

/**
 * createCaseCatalogRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to create the catalog record
 */
exports.createCaseCatalogRecord = async ({ applicationContext, caseId }) => {
  await put({
    Item: {
      caseId,
      pk: 'catalog',
      sk: `case-${caseId}`,
    },
    applicationContext,
  });
};
