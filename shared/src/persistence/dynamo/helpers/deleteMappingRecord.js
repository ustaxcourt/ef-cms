const client = require('../../dynamodbClientService');

exports.deleteMappingRecord = ({ applicationContext, pkId, skId, type }) => {
  return client.delete({
    applicationContext,
    key: {
      pk: `${pkId}|${type}`,
      sk: skId,
    },
  });
};
