const client = require('../../dynamodbClientService');

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

  const results = await client.batchGet({
    applicationContext,
    keys: caseOrder.map(({ caseId }) => ({
      pk: `case|${caseId}`,
      sk: `case|${caseId}`,
    })),
  });

  const resultsWithAggregatedItems = [];

  for (let result of results) {
    const caseItem = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId: result.caseId,
      });

    resultsWithAggregatedItems.push({
      ...result,
      ...caseItem,
    });
  }

  const afterMapping = caseOrder.map(myCase => ({
    ...myCase,
    ...resultsWithAggregatedItems.find(r => myCase.caseId === r.caseId),
  }));

  return afterMapping;
};
