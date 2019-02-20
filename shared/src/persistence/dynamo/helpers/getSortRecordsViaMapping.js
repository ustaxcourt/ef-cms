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
    TableName: TABLE,
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `${key}|${type}`,
      ':afterDate': afterDate,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
  });

  const ids = mapping.map(metadata => metadata[foreignKey]);

  const results = await client.batchGet({
    applicationContext,
    tableName: TABLE,
    keys: ids.map(id => ({
      pk: id,
      sk: isVersioned ? '0' : id,
    })),
  });

  return stripInternalKeys(results);
};
