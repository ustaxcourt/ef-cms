const client = require('../../dynamodbClientService');

exports.updateWorkItem = async ({ applicationContext, workItemToUpdate }) => {
  await client.put({
    Item: {
      pk: `workitem-${workItemToUpdate.workItemId}`,
      sk: `workitem-${workItemToUpdate.workItemId}`,
      ...workItemToUpdate,
    },
    applicationContext,
  });
};
