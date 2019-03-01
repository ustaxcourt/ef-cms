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
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${key}|${type}`,
    },
    KeyConditionExpression: '#pk = :pk',
    TableName: TABLE,
  });

  if (!mapping) return null;

  const sk = mapping.sk;

  const results = await client.get({
    applicationContext,
    Key: {
      pk: sk,
      sk: isVersioned ? '0' : sk,
    },
    TableName: TABLE,
  });

  return stripInternalKeys(results);
};
