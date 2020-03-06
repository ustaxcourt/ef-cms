const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { getCaseDocketRecord } = require('./getCaseDocketRecord');
const { getCaseDocuments } = require('./getCaseDocuments');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getCasesByUser = async ({ applicationContext, userId }) => {
  let cases = await getRecordsViaMapping({
    applicationContext,
    pk: `user|${userId}`,
    prefix: 'case',
  });

  console.log('LECASES', cases);
  console.log('userId', userId);

  cases = await Promise.all(
    cases.map(getCaseDocketRecord({ applicationContext })),
  );
  cases = await Promise.all(
    cases.map(getCaseDocuments({ applicationContext })),
  );

  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
