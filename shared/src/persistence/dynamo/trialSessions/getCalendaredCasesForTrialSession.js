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

  const resultsWithDocketRecords = [];

  for (let result of results) {
    let docketRecord = await client.query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${result.caseId}`,
        ':prefix': 'docket-record',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    });

    docketRecord = docketRecord.length > 0 ? docketRecord : result.docketRecord;

    resultsWithDocketRecords.push({
      ...result,
      docketRecord,
    });
  }

  const afterMapping = caseOrder.map(myCase => ({
    ...myCase,
    ...resultsWithDocketRecords.find(r => myCase.caseId === r.caseId),
  }));

  return afterMapping;
};
