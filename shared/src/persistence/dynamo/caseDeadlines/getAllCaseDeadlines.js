const client = require('../../dynamodbClientService');

exports.getAllCaseDeadlines = async ({ applicationContext }) => {
  const mappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': 'case-deadline-catalog',
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const ids = mappings.map(metadata => metadata.caseDeadlineId);

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: `case-deadline|${id}`,
      sk: `case-deadline|${id}`,
    })),
  });

  const afterMapping = ids.map(m => ({
    ...results.find(r => m === r.caseDeadlineId),
  }));

  return afterMapping;
};
