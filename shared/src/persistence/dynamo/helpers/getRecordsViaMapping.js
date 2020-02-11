const client = require('../../dynamodbClientService');

exports.getRecordsViaMapping = async ({ applicationContext, key, type }) => {
  const mappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${key}|${type}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const ids = mappings.map(metadata => metadata.sk);

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: id,
    })),
  });

  const afterMapping = mappings.map(m => ({
    ...m,
    ...results.find(r => m.sk === r.pk),
  }));

  return afterMapping;
};
