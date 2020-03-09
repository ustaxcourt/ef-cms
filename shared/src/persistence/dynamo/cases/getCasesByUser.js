const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { getCaseDocketRecord } = require('./getCaseDocketRecord');
const { getCaseDocuments } = require('./getCaseDocuments');
const { getCasePractitioners } = require('./getCasePractitioners');
const { getCaseRespondents } = require('./getCaseRespondents');
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
    cases.map(getCaseRespondents({ applicationContext })),
  );
  cases = await Promise.all(
    cases.map(getCasePractitioners({ applicationContext })),
  );

  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
