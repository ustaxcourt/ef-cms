const client = require('../../dynamodbClientService');

exports.getUsersInSection = ({ applicationContext, section }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

  return client.query({
    applicationContext,
    TableName: TABLE,
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${section}|user`,
    },
    KeyConditionExpression: '#pk = :pk',
  });
};
