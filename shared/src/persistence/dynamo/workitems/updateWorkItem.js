const client = require('../../dynamodbClientService');

exports.updateWorkItem = async ({ workItemToUpdate, applicationContext }) => {
  await client.put({
    applicationContext,
    Item: {
      pk: workItemToUpdate.workItemId,
      sk: workItemToUpdate.workItemId,
      ...workItemToUpdate,
    },
  });
};
