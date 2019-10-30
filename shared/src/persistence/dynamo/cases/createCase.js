const client = require('../../dynamodbClientService');
const {
  createCaseCatalogRecord,
} = require('../../dynamo/cases/createCaseCatalogRecord');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

/**
 * createCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToCreate the case data
 * @returns {object} the case data
 */
exports.createCase = async ({ applicationContext, caseToCreate }) => {
  const [results] = await Promise.all([
    client.put({
      Item: {
        pk: caseToCreate.caseId,
        sk: caseToCreate.caseId,
        ...caseToCreate,
      },
      applicationContext,
    }),
    createMappingRecord({
      applicationContext,
      pkId: caseToCreate.userId,
      skId: caseToCreate.caseId,
      type: 'case',
    }),
    createMappingRecord({
      applicationContext,
      pkId: caseToCreate.docketNumber,
      skId: caseToCreate.caseId,
      type: 'case',
    }),
    createCaseCatalogRecord({
      applicationContext,
      caseId: caseToCreate.caseId,
    }),
  ]);

  return stripWorkItems(
    stripInternalKeys(results),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
