export const documentHelper = () => ({ docketNumber, documentId }) => {
  return `/case-detail/${docketNumber}/documents/${documentId}`;
};
