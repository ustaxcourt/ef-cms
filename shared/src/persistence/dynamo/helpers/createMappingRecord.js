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
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: `${pkId}|${type}`,
      sk: skId,
      ...item,
    },
  });
};
