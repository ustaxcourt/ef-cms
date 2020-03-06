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

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: id,
    })),
  });

  const cases = [];
  mappings.forEach(mapping => {
    const aCase = results.find(c => mapping.sk === c.pk);
    if (aCase) {
      cases.push({
        ...mapping,
        ...aCase,
      });
    }
  });

  return cases;
};
