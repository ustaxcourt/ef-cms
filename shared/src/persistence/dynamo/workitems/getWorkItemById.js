const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getWorkItemById = ({ workItemId, applicationContext }) => {
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
