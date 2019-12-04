const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getConsolidatedCasesByUser = async ({ applicationContext, userId }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'consolidated-case',
  });

  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
