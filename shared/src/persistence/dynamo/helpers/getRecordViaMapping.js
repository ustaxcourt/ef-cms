const { stripInternalKeys } = require('./stripInternalKeys');
const client = require('../../dynamodbClientService');

exports.getRecordViaMapping = async ({
  applicationContext,
  key,
  type,
  isVersioned = false,
}) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

  const [mapping] = await client.query({
    applicationContext,
    TableName: TABLE,
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${key}|${type}`,
    },
    KeyConditionExpression: '#pk = :pk',
  });

  if (!mapping) return null;

  const sk = mapping.sk;

  const results = await client.get({
    applicationContext,
    TableName: TABLE,
    Key: {
      pk: sk,
      sk: isVersioned ? '0' : sk,
    },
  });

  return stripInternalKeys(results);
};
