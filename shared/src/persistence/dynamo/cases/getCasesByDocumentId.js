const {
  getRecordsViaMapping,
  stripInternalKeys,
  stripWorkItems,
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
    isVersioned: true,
  });

  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
