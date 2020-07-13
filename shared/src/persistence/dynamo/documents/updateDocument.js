const client = require('../../dynamodbClientService');

exports.updateDocument = async ({
  applicationContext,
  caseId,
  document,
  documentId,
}) => {
  await client.put({
    Item: {
      pk: `case|${caseId}`,
      sk: `document|${documentId}`,
      ...document,
    },
    applicationContext,
  });
};
