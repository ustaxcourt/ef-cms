const client = require('../../dynamodbClientService');

exports.deleteDocument = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  await client.delete({
    applicationContext,
    key: {
      pk: `case|${docketNumber}`,
      sk: `document|${documentId}`,
    },
  });
};
