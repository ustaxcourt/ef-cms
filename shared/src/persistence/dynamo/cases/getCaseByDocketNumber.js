const {
  getRecordViaMapping,
} = require('../../dynamo/helpers/getRecordViaMapping');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

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
    isVersioned: true,
    key: docketNumber,
    type: 'case',
  });

  return stripWorkItems(
    stripInternalKeys(aCase),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
