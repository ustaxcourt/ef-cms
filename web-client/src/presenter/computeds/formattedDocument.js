import { state } from 'cerebral';

export const formattedDocument = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);

  const document = applicationContext.getUtilities().getAttachmentDocumentById({
    caseDetail,
    documentId,
  });

  if (!document) {
    return;
  }

  const docketEntryFormatted = applicationContext
    .getUtilities()
    .formatDocketEntry(applicationContext, document);

  return docketEntryFormatted;
};
