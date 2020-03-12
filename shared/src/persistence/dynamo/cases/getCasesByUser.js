const {
  getCasePrivatePractitioners,
} = require('./getCasePrivatePractitioners');
const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');
<<<<<<< HEAD
const { getCaseByCaseId } = require('./getCaseByCaseId');
=======
const { getCaseDocketRecord } = require('./getCaseDocketRecord');
const { getCaseDocuments } = require('./getCaseDocuments');
const { getCaseIrsPractitioners } = require('./getCaseIrsPractitioners');
>>>>>>> develop
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getCasesByUser = async ({ applicationContext, userId }) => {
  let cases = await getRecordsViaMapping({
    applicationContext,
    pk: `user|${userId}`,
    prefix: 'case',
  });

<<<<<<< HEAD
  for (let i = 0; i < cases.length; i++) {
    cases[i] = {
      ...cases[i],
      ...(await getCaseByCaseId({
        applicationContext,
        caseId: cases[i].caseId,
      })),
    };
  }
=======
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
>>>>>>> develop

  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
