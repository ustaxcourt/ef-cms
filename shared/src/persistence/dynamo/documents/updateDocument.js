const client = require('../../dynamodbClientService');

exports.updateDocument = async ({
  applicationContext,
  docketNumber,
  document,
  documentId,
}) => {
  await client.put({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `document|${documentId}`,
      ...document,
    },
    applicationContext,
  });
};
