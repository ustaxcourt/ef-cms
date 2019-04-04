const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getWorkItemById = async ({ workItemId, applicationContext }) => {
  const workItem = await client.get({
    Key: {
      pk: workItemId,
      sk: workItemId,
    },
    applicationContext,
  });
  return stripInternalKeys(workItem);
};
