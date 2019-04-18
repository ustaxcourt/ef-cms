const client = require('../../dynamodbClientService');

exports.createMappingRecord = async ({
  applicationContext,
  pkId,
  skId,
  type,
  item = {},
}) => {
  return client.put({
    Item: {
      pk: `${pkId}|${type}`,
      sk: skId,
      ...item,
    },
    applicationContext,
  });
};
