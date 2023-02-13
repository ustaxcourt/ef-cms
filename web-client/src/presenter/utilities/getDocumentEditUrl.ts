const getDocumentEditUrl = ({ caseDetail, document }) => {
  const MISCELLANEOUS_DOCUMENT_TYPE = 'Miscellaneous';

  const isMiscellaneous = document.documentType === MISCELLANEOUS_DOCUMENT_TYPE;

  const editUrl = isMiscellaneous
    ? `/case-detail/${caseDetail.docketNumber}/edit-upload-court-issued/${document.docketEntryId}`
    : `/case-detail/${caseDetail.docketNumber}/edit-order/${document.docketEntryId}`;

  return editUrl;
};

export { getDocumentEditUrl };
