const client = require('../../dynamodbClientService');

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

  let docketNumbers = [];
  mappings.map(metadata => {
    const { docketNumber } = metadata;
    if (docketNumbers.includes(docketNumber)) {
      console.warn(
        `Encountered duplicate eligible-for-trial-case-catalog mapping for case ${docketNumber}.`,
      );
    } else {
      docketNumbers.push(docketNumber);
    }
  });

  const results = await client.batchGet({
    applicationContext,
    keys: docketNumbers.map(docketNumber => ({
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    })),
  });

  const aggregatedResults = await Promise.all(
    results.map(async result => {
      const caseItems = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber: result.docketNumber,
        });

      return {
        ...result,
        ...caseItems,
      };
    }),
  );

  const afterMapping = docketNumbers.map(docketNumber => ({
    ...aggregatedResults.find(r => docketNumber === r.docketNumber),
  }));

  return afterMapping;
};
