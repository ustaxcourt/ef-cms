const client = require('../../dynamodbClientService');

exports.deleteUserInboxRecord = ({ applicationContext, workItem }) => {
  return client.delete({
    applicationContext,
    key: {
      pk: `user-${workItem.assigneeId}`,
      sk: `workitem-${workItem.workItemId}`,
    },
  });
};
