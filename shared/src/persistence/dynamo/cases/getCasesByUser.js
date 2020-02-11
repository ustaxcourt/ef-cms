const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getCasesByUser = async ({ applicationContext, userId }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'case',
  });

  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
