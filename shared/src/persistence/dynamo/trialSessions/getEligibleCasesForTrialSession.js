const client = require('../../dynamodbClientService');
const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');

exports.getEligibleCasesForTrialSession = async ({
  applicationContext,
  limit,
  skPrefix,
}) => {
  const mappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': 'eligible-for-trial-case-catalog',
      ':prefix': skPrefix,
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    Limit: limit,
    applicationContext,
  });

  const docketNumbers = mappings.map(metadata => metadata.docketNumber);

  const caseIds = await Promise.all(
    docketNumbers.map(docketNumber =>
      getCaseIdFromDocketNumber({ applicationContext, docketNumber }),
    ),
  );

  const results = await client.batchGet({
    applicationContext,
    keys: caseIds.map(caseId => ({
      pk: `case|${caseId}`,
      sk: `case|${caseId}`,
    })),
  });

  const aggregatedResults = [];

  for (let result of results) {
    const caseItems = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber: result.docketNumber,
      });

    aggregatedResults.push({
      ...result,
      ...caseItems,
    });
  }

  const afterMapping = docketNumbers.map(docketNumber => ({
    ...aggregatedResults.find(r => docketNumber === r.docketNumber),
  }));

  return afterMapping;
};
