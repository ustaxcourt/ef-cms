const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getCasesByUser = async ({ userId, applicationContext }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    isVersioned: true,
    key: userId,
    type: 'case',
  });

  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
