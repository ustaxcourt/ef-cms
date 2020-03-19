const getDocumentEditUrl = ({ caseDetail, document }) => {
  // TODO: get from applicationContext
  const STIPULATED_DECISION_DOCUMENT_TYPE = 'Stipulated Decision';
  const MISCELLANEOUS_DOCUMENT_TYPE = 'MISC - Miscellaneous';

  const isStipDecision =
    document.documentType === STIPULATED_DECISION_DOCUMENT_TYPE;
  const isMiscellaneous = document.documentType === MISCELLANEOUS_DOCUMENT_TYPE;

  const editUrl = isStipDecision
    ? `/case-detail/${caseDetail.docketNumber}/documents/${document.documentId}/sign`
    : isMiscellaneous
    ? `/case-detail/${caseDetail.docketNumber}/edit-upload-court-issued/${document.documentId}`
    : `/case-detail/${caseDetail.docketNumber}/edit-order/${document.documentId}`;

  return editUrl;
};

export { getDocumentEditUrl };
