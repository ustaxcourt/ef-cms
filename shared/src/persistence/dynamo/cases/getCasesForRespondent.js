const {
  stripWorkItems,
  stripInternalKeys,
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
    isVersioned: true,
  });

  return applicationContext.filterCaseMetadata({
    cases: stripWorkItems(
      stripInternalKeys(cases),
      applicationContext.isAuthorizedForWorkItems(),
    ),
    applicationContext,
  });
};
