const { put } = require('../../dynamodbClientService');

/**
 * createCaseCatalogRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to create the catalog record
 */
exports.createCaseCatalogRecord = async ({
  applicationContext,
  caseToCreate,
}) => {
  const yearFiled = 2000 + caseToCreate.docketNumber.split('-')[1];

  await put({
    Item: {
      caseCaption: caseToCreate.caseCaption,
      caseId: caseToCreate.caseId,
      contactPrimary: caseToCreate.contactPrimary,
      contactSecondary: caseToCreate.contactSecondary,
      docketNumber: caseToCreate.docketNumber,
      docketNumberSuffix: caseToCreate.docketNumberSuffix,
      filedDate: caseToCreate.createdAt,
      pk: 'catalog',
      sk: `case-${caseToCreate.caseId}`,
      yearFiled,
    },
    applicationContext,
  });
};
