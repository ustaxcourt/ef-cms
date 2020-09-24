import { state } from 'cerebral';

export const formattedDocument = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);

  const document = applicationContext.getUtilities().getAttachmentDocumentById({
    caseDetail,
    documentId: docketEntryId,
  });

  if (!document) {
    return;
  }

  const docketEntryFormatted = applicationContext
    .getUtilities()
    .formatDocketEntry(applicationContext, document);

  return docketEntryFormatted;
};
