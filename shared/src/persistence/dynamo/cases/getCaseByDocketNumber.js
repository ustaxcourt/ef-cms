const {
  getRecordViaMapping,
  stripInternalKeys,
  stripWorkItems,
} = require('../../awsDynamoPersistence');

/**
 * getCaseByDocketNumber
 * @param docketNumber
 * @param applicationContext
 * @returns {*}
 */
exports.getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
}) => {
  const aCase = await getRecordViaMapping({
    applicationContext,
    key: docketNumber,
    type: 'case',
  });

  return stripWorkItems(
    stripInternalKeys(aCase),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
