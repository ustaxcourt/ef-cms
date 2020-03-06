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
      pk: `${type}|${pkId}`,
      sk: skId,
      ...item,
    },
    applicationContext,
  });
};
