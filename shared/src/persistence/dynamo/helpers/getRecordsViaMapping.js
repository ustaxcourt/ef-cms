const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('./stripInternalKeys');

exports.getRecordsViaMapping = async ({
  applicationContext,
  key,
  type,
  isVersioned = false,
}) => {
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
      sk: isVersioned ? '0' : id,
    })),
  });

  const mergedResults = results.map(result => {
    const mapping = mappings.find(mapping => mapping.sk === result.pk);
    return {
      ...result,
      ...mapping,
    };
  });

  return stripInternalKeys(mergedResults);
};
