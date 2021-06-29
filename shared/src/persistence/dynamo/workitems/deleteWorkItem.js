const client = require('../../dynamodbClientService');

exports.deleteWorkItem = ({ applicationContext, workItem }) => {
  return client.delete({
    applicationContext,
    key: {
      pk: `work-item|${workItem.workItemId}`,
      sk: `work-item|${workItem.workItemId}`,
    },
  });
};
