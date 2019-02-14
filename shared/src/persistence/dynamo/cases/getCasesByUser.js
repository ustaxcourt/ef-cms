const {
  getRecordsViaMapping,
  stripInternalKeys,
  stripWorkItems,
} = require('../../awsDynamoPersistence');

exports.getCasesByUser = async ({ user, applicationContext }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    key: user.userId,
    type: 'case',
    isVersioned: true,
  });

  return stripWorkItems(
    stripInternalKeys(cases),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
