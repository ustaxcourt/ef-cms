const { getRecordsViaMapping } = require('../../awsDynamoPersistence');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

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

  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
