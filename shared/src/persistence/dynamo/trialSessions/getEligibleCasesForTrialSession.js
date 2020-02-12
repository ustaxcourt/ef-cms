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

  const ids = mappings.map(metadata => metadata.caseId);

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: id,
    })),
  });

  const afterMapping = ids.map(m => ({
    ...results.find(r => m === r.pk),
  }));

  return afterMapping;
};
