const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

const { saveVersionedCase } = require('../../dynamo/cases/saveCase');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

/**
 * createCase
 * @param caseToCreate
 * @param applicationContext
 * @returns {*}
 */
exports.createCase = async ({ caseToCreate, applicationContext }) => {
  await createMappingRecord({
    applicationContext,
    pkId: caseToCreate.userId,
    skId: caseToCreate.caseId,
    type: 'case',
  });

  await createMappingRecord({
    applicationContext,
    pkId: caseToCreate.docketNumber,
    skId: caseToCreate.caseId,
    type: 'case',
  });

  const results = await saveVersionedCase({
    applicationContext,
    caseToSave: caseToCreate,
    existingVersion: (caseToCreate || {}).currentVersion,
  });

  return stripWorkItems(
    stripInternalKeys(results),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
