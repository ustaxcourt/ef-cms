const client = require('../../dynamodbClientService');

exports.createMappingRecord = async ({
  applicationContext,
  pkId,
  skId,
  type,
  item = {},
}) => {
  return client.put({
    applicationContext,
    Item: {
      pk: `${pkId}|${type}`,
      sk: skId,
      ...item,
    },
    TableName: `efcms-${applicationContext.environment.stage}`,
  });
};
