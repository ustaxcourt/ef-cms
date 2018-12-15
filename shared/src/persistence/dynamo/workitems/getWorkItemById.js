const client = require('../../dynamodbClientService');

exports.getWorkItemById = ({ workItemId, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  return client.get({
    TableName: TABLE,
    Key: {
      pk: workItemId,
      sk: workItemId,
    },
  });
};
