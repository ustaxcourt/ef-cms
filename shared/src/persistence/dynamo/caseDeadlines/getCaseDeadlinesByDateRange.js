const client = require('../../dynamodbClientService');

exports.getCaseDeadlinesByDateRange = async ({
  applicationContext,
  endDate,
  startDate,
}) => {
  const mappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':endDate': endDate,
      ':pk': 'case-deadline-catalog',
      ':startDate': startDate,
    },
    KeyConditionExpression: '#pk = :pk and #sk between :startDate and :endDate',
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
