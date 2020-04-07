const client = require('../../dynamodbClientService');

exports.getWorkItemById = ({ applicationContext, workItemId }) => {
  return client.get({
    Key: {
      pk: `work-item|${workItemId}`,
      sk: `work-item|${workItemId}`,
    },
    applicationContext,
  });
};
