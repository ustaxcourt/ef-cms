const client = require('../../dynamodbClientService');
const { getCaseByDocketNumber } = require('../cases/getCaseByDocketNumber');

exports.getCalendaredCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
}) => {
  const trialSession = await client.get({
    Key: {
      pk: `trial-session|${trialSessionId}`,
      sk: `trial-session|${trialSessionId}`,
    },
    applicationContext,
  });

  const { caseOrder } = trialSession;

  for (let i = 0; i < caseOrder.length; i++) {
    caseOrder[i] = {
      ...caseOrder[i],
      ...(await getCaseByDocketNumber({
        applicationContext,
        docketNumber: caseOrder[i].docketNumber,
      })),
    };
  }

  return caseOrder;
};
