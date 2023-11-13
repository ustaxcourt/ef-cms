import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const formattedDocument = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
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
