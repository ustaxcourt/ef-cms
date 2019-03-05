const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getWorkItemById = async ({ workItemId, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  const workItem = await client.get({
    applicationContext,
    Key: {
      pk: workItemId,
      sk: workItemId,
    },
    TableName: TABLE,
  });
  return stripInternalKeys(workItem);
};
