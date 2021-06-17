const client = require('../../dynamodbClientService');

exports.getUserCaseMappingsByDocketNumber = ({
  applicationContext,
  docketNumber,
}) => {
  return client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `user-case|${docketNumber}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });
};
