export const documentHelper = () => ({
  docketNumber,
  documentId,
  markWorkItemRead,
  messageId,
}) => {
  const baseUri = `/case-detail/${docketNumber}/documents/${documentId}`;
  if (messageId) {
    return `${baseUri}/messages/${messageId}`;
  } else if (markWorkItemRead) {
    return `${baseUri}/qc/${markWorkItemRead}`;
  } else {
    return baseUri;
  }
};
