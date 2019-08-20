const {
  createCaseCatalogRecord,
} = require('../../dynamo/cases/createCaseCatalogRecord');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

const { saveVersionedCase } = require('../../dynamo/cases/saveCase');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

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
    saveVersionedCase({
      applicationContext,
      caseToSave: caseToCreate,
      existingVersion: (caseToCreate || {}).currentVersion,
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
