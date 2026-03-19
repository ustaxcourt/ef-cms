import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { CONTACT_CHANGE_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';

export const docketEntryQcHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const formattedCaseDetail = get(state.formattedCaseDetail);

  const currentDocument = caseDetail.docketEntries.find(
    docketEntry => docketEntry.docketEntryId === docketEntryId,
  );

  let showPaperServiceWarning = false;

  if (
    CONTACT_CHANGE_DOCUMENT_TYPES.includes(currentDocument?.documentType || '')
  ) {
    const hasWorkItemInfo =
      currentDocument && DocketEntry.hasWorkItemInfo(currentDocument);
    const qcWorkItemsUntouched =
      hasWorkItemInfo &&
      !currentDocument.qcViewed &&
      !currentDocument.qcComplete;

    if (qcWorkItemsUntouched) {
      showPaperServiceWarning = true;
    }
  }

  const formattedDocketEntry = applicationContext
    .getUtilities()
    .formatDocketEntry(applicationContext, currentDocument as RawDocketEntry);

  const memberCases = formattedCaseDetail.consolidatedCases.filter(
    (c: { docketNumber: string }) => c.docketNumber !== caseDetail.docketNumber,
  );

  const showQCHelpText = DocketEntry.isMultiDocketed(formattedDocketEntry);

  return {
    formattedDocketEntry,
    showPaperServiceWarning,
    memberCases,
    showQCHelpText,
  };
};
