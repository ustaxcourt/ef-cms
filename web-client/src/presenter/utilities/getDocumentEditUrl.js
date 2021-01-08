const getDocumentEditUrl = ({ caseDetail, doc }) => {
  const MISCELLANEOUS_DOCUMENT_TYPE = 'Miscellaneous';

  const isMiscellaneous = doc.documentType === MISCELLANEOUS_DOCUMENT_TYPE;

  const editUrl = isMiscellaneous
    ? `/case-detail/${caseDetail.docketNumber}/edit-upload-court-issued/${doc.docketEntryId}`
    : `/case-detail/${caseDetail.docketNumber}/edit-order/${doc.docketEntryId}`;

  return editUrl;
};

export { getDocumentEditUrl };
