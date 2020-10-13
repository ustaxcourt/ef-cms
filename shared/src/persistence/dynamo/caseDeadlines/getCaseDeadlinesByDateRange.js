const client = require('../../dynamodbClientService');

exports.getCaseDeadlinesByDateRange = async ({
  applicationContext,
  endDate,
  startDate,
}) => {
  const mappings = await client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':endDate': endDate,
      ':gsi1pk': 'case-deadline-catalog',
      ':startDate': startDate,
    },
    IndexName: 'gsi1',
    KeyConditionExpression:
      '#gsi1pk = :gsi1pk and #pk between :startDate and :endDate',
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
