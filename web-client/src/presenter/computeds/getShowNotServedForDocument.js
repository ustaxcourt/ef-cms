export const getShowNotServedForDocument = ({
  caseDetail,
  documentId,
  draftDocuments,
  UNSERVABLE_EVENT_CODES,
}) => {
  let showNotServed = false;

  const caseDocument = caseDetail.documents.find(
    document => document.documentId === documentId,
  );

  if (caseDocument) {
    const isUnservable = UNSERVABLE_EVENT_CODES.includes(
      caseDocument.eventCode,
    );

    const isDraftDocument =
      draftDocuments &&
      !!draftDocuments.find(draft => draft.documentId === documentId);

    showNotServed = !isUnservable && !caseDocument.servedAt && !isDraftDocument;
  }

  return showNotServed;
};
