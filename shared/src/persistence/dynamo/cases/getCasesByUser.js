const {
  getRecordsViaMapping,
  stripWorkItems,
} = require('../../awsDynamoPersistence');

exports.getCasesByUser = async ({ userId, applicationContext }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'case',
  });
  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
