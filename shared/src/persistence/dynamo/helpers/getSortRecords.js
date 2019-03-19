const { stripInternalKeys } = require('./stripInternalKeys');
const client = require('../../dynamodbClientService');

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
