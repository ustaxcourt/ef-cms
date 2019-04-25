export const documentHelper = () => ({
  docketNumber,
  documentId,
  messageId,
}) => {
  return `/case-detail/${docketNumber}/documents/${documentId}/messages/${messageId}`;
};
