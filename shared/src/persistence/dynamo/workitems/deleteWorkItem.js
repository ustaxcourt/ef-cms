const client = require('../../dynamodbClientService');

exports.deleteWorkItem = ({ applicationContext, workItem }) =>
  client.delete({
    applicationContext,
    key: {
      pk: `case|${workItem.docketNumber}`,
      sk: `work-item|${workItem.workItemId}`,
    },
  });
