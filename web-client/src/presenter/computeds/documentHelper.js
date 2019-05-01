export const documentHelper = () => ({
  docketNumber,
  documentId,
  messageId,
}) => {
  const baseUri = `/case-detail/${docketNumber}/documents/${documentId}`;
  if (messageId) {
    return `${baseUri}/messages/${messageId}`;
  } else {
    return baseUri;
  }
};
