const {
  getRecordViaMapping,
} = require('../../dynamo/helpers/getRecordViaMapping');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

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
    isVersioned: true,
  });

  return stripWorkItems(
    stripInternalKeys(aCase),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
