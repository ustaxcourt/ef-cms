const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getCasesByUser = async ({ userId, applicationContext }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'case',
    isVersioned: true,
  });

  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
