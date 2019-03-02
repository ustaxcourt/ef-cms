const client = require('../../dynamodbClientService');

exports.deleteMappingRecord = async ({
  applicationContext,
  pkId,
  skId,
  type,
}) => {
  await client.delete({
    applicationContext,
    key: {
      pk: `${pkId}|${type}`,
      sk: skId,
    },
    tableName: `efcms-${applicationContext.environment.stage}`,
  });
};
