const client = require('../../dynamodbClientService');
const { getCaseByDocketNumber } = require('../cases/getCaseByDocketNumber');
const { map } = require('lodash');

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
  const docketNumbers = map(caseOrder, 'docketNumber');

  const casesByDocketNumber = await Promise.all(
    docketNumbers.map(docketNumber =>
      getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  for (let i = 0; i < caseOrder.length; i++) {
    caseOrder[i] = {
      ...caseOrder[i],
      ...casesByDocketNumber[i],
    };
  }

  return caseOrder;
};
