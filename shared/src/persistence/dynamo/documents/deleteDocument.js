const client = require('../../dynamodbClientService');

exports.deleteDocument = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  await client.delete({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `document|${documentId}`,
    },
    applicationContext,
  });
};
