const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
const { getCaseByCaseId } = require('./getCaseByCaseId');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getCasesByUser = async ({
  applicationContext,
  printOut = false,
  userId,
}) => {
  let cases = await getRecordsViaMapping({
    applicationContext,
    pk: `user|${userId}`,
    prefix: 'case',
  });

  if (printOut) {
    console.log('LE USER CASES', cases);
  }

  for (let i = 0; i < cases.length; i++) {
    cases[i] = {
      ...cases[i],
      ...(await getCaseByCaseId({
        applicationContext,
        caseId: cases[i].caseId,
      })),
    };
  }

  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
