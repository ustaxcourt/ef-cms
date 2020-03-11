const {
  getCasePrivatePractitioners,
} = require('./getCasePrivatePractitioners');
const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { getCaseDocketRecord } = require('./getCaseDocketRecord');
const { getCaseDocuments } = require('./getCaseDocuments');
const { getCaseIrsPractitioners } = require('./getCaseIrsPractitioners');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getCasesByUser = async ({ applicationContext, userId }) => {
  let cases = await getRecordsViaMapping({
    applicationContext,
    pk: `user|${userId}`,
    prefix: 'case',
  });

  cases = await Promise.all(
    cases.map(getCaseDocketRecord({ applicationContext })),
  );
  cases = await Promise.all(
    cases.map(getCaseDocuments({ applicationContext })),
  );
  cases = await Promise.all(
    cases.map(getCaseIrsPractitioners({ applicationContext })),
  );
  cases = await Promise.all(
    cases.map(getCasePrivatePractitioners({ applicationContext })),
  );

  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
