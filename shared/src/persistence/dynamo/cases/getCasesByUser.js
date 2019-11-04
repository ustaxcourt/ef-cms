const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getCasesByUser = async ({ applicationContext, userId }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'case',
  });

  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
