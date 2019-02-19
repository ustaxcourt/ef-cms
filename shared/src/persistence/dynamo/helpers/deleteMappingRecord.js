const client = require('../../dynamodbClientService');

exports.deleteMappingRecord = async ({
  applicationContext,
  pkId,
  skId,
  type,
}) => {
  await client.delete({
    applicationContext,
    tableName: `efcms-${applicationContext.environment.stage}`,
    key: {
      pk: `${pkId}|${type}`,
      sk: skId,
    },
  });
};
