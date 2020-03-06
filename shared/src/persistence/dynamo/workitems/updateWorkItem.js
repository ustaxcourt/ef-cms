const client = require('../../dynamodbClientService');

exports.updateWorkItem = async ({ applicationContext, workItemToUpdate }) => {
  await client.put({
    Item: {
      pk: `work-item|${workItemToUpdate.workItemId}`,
      sk: `work-item|${workItemToUpdate.workItemId}`,
      ...workItemToUpdate,
    },
    applicationContext,
  });
};
