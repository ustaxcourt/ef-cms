const { stripInternalKeys } = require('./stripInternalKeys');
const client = require('../../dynamodbClientService');

exports.getSortRecordsViaMapping = async ({
  applicationContext,
  key,
  type,
  foreignKey,
  afterDate,
  isVersioned = false,
}) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

  const mapping = await client.query({
    applicationContext,
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': afterDate,
      ':pk': `${key}|${type}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    TableName: TABLE,
  });

  const ids = mapping.map(metadata => metadata[foreignKey]);

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: isVersioned ? '0' : id,
    })),
    tableName: TABLE,
  });

  return stripInternalKeys(results);
};
