const {
  stripWorkItems,
  getRecordViaMapping,
  stripInternalKeys,
} = require('../../awsDynamoPersistence');

/**
 * getCaseByDocketNumber
 * @param docketNumber
 * @param applicationContext
 * @returns {*}
 */
exports.getCaseByDocketNumber = async ({
  docketNumber,
  applicationContext,
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
