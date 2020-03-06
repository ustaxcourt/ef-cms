const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { getCaseDocketRecord } = require('./getCaseDocketRecord');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getCasesByUser = async ({ applicationContext, userId }) => {
  let cases = await getRecordsViaMapping({
    applicationContext,
    pk: `user|${userId}`,
    prefix: 'case',
  });

  console.log('cases', cases);

  cases = await Promise.all(
    cases.map(getCaseDocketRecord({ applicationContext })),
  );

  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
