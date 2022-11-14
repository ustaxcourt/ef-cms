export const getDocumentIdFromSQSMessage = (message: { Body: string }) => {
  const { Body: body } = message;
  const parsedBody = JSON.parse(body);
  const documentId: string = parsedBody.Records[0].s3.object.key;
  return documentId;
};
