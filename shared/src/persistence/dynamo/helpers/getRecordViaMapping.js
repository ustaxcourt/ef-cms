const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('./stripInternalKeys');

exports.getRecordViaMapping = async ({
  applicationContext,
  isVersioned = false,
  key,
  type,
}) => {
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
      sk: isVersioned ? '0' : sk,
    },
    applicationContext,
  });

  const afterMapping = {
    ...mapping,
    ...results,
  };

  return stripInternalKeys(afterMapping);
};
