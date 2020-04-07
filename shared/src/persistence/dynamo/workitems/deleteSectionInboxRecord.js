const client = require('../../dynamodbClientService');

exports.deleteSectionInboxRecord = ({ applicationContext, workItem }) => {
  return client.delete({
    applicationContext,
    key: {
      pk: `section|${workItem.section}`,
      sk: `work-item|${workItem.workItemId}`,
    },
  });
};
