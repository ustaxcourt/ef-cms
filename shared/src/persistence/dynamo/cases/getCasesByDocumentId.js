const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

/**
 * getCasesByDocumentId
 * @param status
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesByDocumentId = async ({ documentId, applicationContext }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    key: documentId,
    type: 'case',
    isVersioned: true,
  });

  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
