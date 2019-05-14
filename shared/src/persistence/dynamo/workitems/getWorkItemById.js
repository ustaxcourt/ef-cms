const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getWorkItemById = ({ workItemId, applicationContext }) => {
  return client
    .get({
      Key: {
        pk: workItemId,
        sk: workItemId,
      },
      applicationContext,
    })
    .then(stripInternalKeys);
};
