import { state } from 'cerebral';

export const formattedDocument = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);

  const allCaseDocuments = [
    ...(caseDetail.docketEntries || []),
    ...(caseDetail.correspondence || []),
  ];
  const document = allCaseDocuments.find(
    item => item.documentId === documentId,
  );

  if (!document) {
    return;
  }

  const documentFormatted = applicationContext
    .getUtilities()
    .formatDocument(applicationContext, document);

  return documentFormatted;
};
