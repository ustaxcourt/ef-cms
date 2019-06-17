export const documentHelper = () => ({
  docketNumber,
  documentId,
  messageId,
  workItemIdToMarkAsRead,
}) => {
  const baseUri = `/case-detail/${docketNumber}/documents/${documentId}`;
  if (messageId) {
    return `${baseUri}/messages/${messageId}`;
  } else if (workItemIdToMarkAsRead) {
    return `${baseUri}/qc/${workItemIdToMarkAsRead}`;
  } else {
    return baseUri;
  }
};
