const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getWorkItemById = ({ applicationContext, workItemId }) => {
  return client
    .get({
      Key: {
        pk: `workitem-${workItemId}`,
        sk: `workitem-${workItemId}`,
      },
      applicationContext,
    })
    .then(stripInternalKeys);
};
