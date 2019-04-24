const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('./stripInternalKeys');
const { uniq } = require('lodash');

exports.getSortRecordsViaMapping = async ({
  applicationContext,
  key,
  type,
  foreignKey,
  afterDate,
  isVersioned = false,
}) => {
  const mapping = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': afterDate,
      ':pk': `${key}|${type}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  });

  const ids = uniq(mapping.map(metadata => metadata[foreignKey]));

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: isVersioned ? '0' : id,
    })),
  });

  const afterMapping = mapping.map(m => ({
    ...m,
    ...results.find(r => r.workItemId === m.workItemId),
  }));

  return stripInternalKeys(afterMapping);
};
