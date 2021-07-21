const client = require('../../dynamodbClientService');

exports.updateWorkItem = async ({ applicationContext, workItemToUpdate }) => {
  await client.put({
    Item: {
      gsi1pk: `work-item|${workItemToUpdate.workItemId}`,
      pk: `case|${workItemToUpdate.docketNumber}`,
      sk: `work-item|${workItemToUpdate.workItemId}`,
      ...workItemToUpdate,
    },
    applicationContext,
  });
};
