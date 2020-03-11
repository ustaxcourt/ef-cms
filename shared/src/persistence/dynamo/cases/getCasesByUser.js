const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { getCaseByCaseId } = require('./getCaseByCaseId');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getCasesByUser = async ({ applicationContext, userId }) => {
  let cases = await getRecordsViaMapping({
    applicationContext,
    pk: `user|${userId}`,
    prefix: 'case',
  });

  for (let i = 0; i < cases.length; i++) {
    cases[i] = await getCaseByCaseId({
      applicationContext,
      caseId: cases[i].caseId,
    });
  }

  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
