const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
/**
 * getCasesByStatus
 * @param status
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesByStatus = async ({ status, applicationContext }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    isVersioned: true,
    key: status,
    type: 'case-status',
  });
  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
