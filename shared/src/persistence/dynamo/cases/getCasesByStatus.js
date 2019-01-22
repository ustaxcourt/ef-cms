const {
  getRecordsViaMapping,
  stripWorkItems,
  stripInternalKeys,
} = require('../../awsDynamoPersistence');

/**
 * getCasesByStatus
 * @param status
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesByStatus = async ({ status, applicationContext }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    key: status,
    type: 'case-status',
    isVersioned: true,
  });
  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
