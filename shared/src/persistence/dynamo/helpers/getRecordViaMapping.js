const client = require('../../dynamodbClientService');

exports.getRecordViaMapping = async ({ applicationContext, pk, prefix }) => {
  const [mapping] = await client.query({
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

  if (!mapping) return null;

  const { sk } = mapping;

  const results = await client.get({
    Key: {
      pk: sk,
      sk: sk,
    },
    applicationContext,
  });

  const afterMapping = {
    ...mapping,
    ...results,
  };

  return afterMapping;
};
