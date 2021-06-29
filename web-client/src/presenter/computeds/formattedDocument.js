import { state } from 'cerebral';

export const formattedDocument = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);

  const doc = applicationContext.getUtilities().getAttachmentDocumentById({
    caseDetail,
    documentId: docketEntryId,
  });

  if (!doc) {
    return;
  }

  const docketEntryFormatted = applicationContext
    .getUtilities()
    .formatDocketEntry(applicationContext, doc);

  return docketEntryFormatted;
};
