const client = require('../../dynamodbClientService');

exports.getRecordViaMapping = async ({ applicationContext, key, type }) => {
  const [mapping] = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${key}|${type}`,
    },
    KeyConditionExpression: '#pk = :pk',
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
