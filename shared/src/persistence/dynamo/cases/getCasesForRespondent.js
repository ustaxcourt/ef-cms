const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

/**
 * getCasesForRespondent
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesForRespondent = async ({
  respondentId,
  applicationContext,
}) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    isVersioned: true,
    key: respondentId,
    type: 'activeCase',
  });

  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
