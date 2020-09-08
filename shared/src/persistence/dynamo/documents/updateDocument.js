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
      sk: `docket-entry|${documentId}`,
      ...document,
    },
    applicationContext,
  });
};
