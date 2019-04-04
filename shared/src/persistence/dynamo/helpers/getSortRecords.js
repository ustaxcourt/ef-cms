const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('./stripInternalKeys');

exports.getSortRecords = async ({
  applicationContext,
  key,
  type,
  afterDate,
}) => {
  const records = await client.query({
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
  });

  return stripInternalKeys(records);
};
