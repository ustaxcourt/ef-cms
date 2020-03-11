const client = require('../../dynamodbClientService');

exports.getRecordsViaMapping = async ({ applicationContext, pk, prefix }) => {
  const mappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': pk,
      ':prefix': prefix,
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  const ids = mappings.map(metadata => metadata.sk);

  const batchGetResults = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: id,
    })),
  });

  const results = [];
  mappings.forEach(mapping => {
    const entry = batchGetResults.find(
      batchGetEntry => mapping.sk === batchGetEntry.pk,
    );
    if (entry) {
      results.push({
        ...mapping,
        ...entry,
      });
    }
  });

  return results;
};
