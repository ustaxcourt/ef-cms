const client = require('../../dynamodbClientService');

exports.getWorkItemById = ({ applicationContext, workItemId }) => {
  return client.get({
    Key: {
      pk: `workitem-${workItemId}`,
      sk: `workitem-${workItemId}`,
    },
    applicationContext,
  });
};
