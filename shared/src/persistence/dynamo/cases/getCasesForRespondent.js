const {
  stripWorkItems,
  getRecordsViaMapping,
} = require('../../awsDynamoPersistence');

/**
 * getCasesForRespondent
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesForRespondent = async ({ userId, applicationContext }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'activeCase',
  });
  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
