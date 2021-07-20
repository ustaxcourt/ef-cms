exports.getDocumentIdFromSQSMessage = message => {
  const { Body: body } = message;
  const parsedBody = JSON.parse(body);
  const documentId = parsedBody.Records[0].s3.object.key;
  return documentId;
};
