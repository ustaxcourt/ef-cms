const {
  stripInternalKeys,
  stripWorkItems,
  getRecordsViaMapping,
} = require('../../awsDynamoPersistence');

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
  });
  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
