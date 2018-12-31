const {
  stripWorkItems,
  getRecordsViaMapping,
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
  });
  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
