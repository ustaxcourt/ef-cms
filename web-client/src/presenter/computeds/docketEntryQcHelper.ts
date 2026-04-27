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

  const docketEntry = caseDetail.docketEntries.find(
    docketEntry => docketEntry.docketEntryId === docketEntryId,
  );

  let showPaperServiceWarning = false;

  if (CONTACT_CHANGE_DOCUMENT_TYPES.includes(docketEntry?.documentType || '')) {
    const hasWorkItemInfo =
      docketEntry && DocketEntry.hasWorkItemInfo(docketEntry);
    const qcWorkItemsUntouched =
      hasWorkItemInfo && !docketEntry.qcViewed && !docketEntry.qcComplete;

    if (qcWorkItemsUntouched) {
      showPaperServiceWarning = true;
    }
  }

  const formattedDocketEntry = applicationContext
    .getUtilities()
    .formatDocketEntry(applicationContext, docketEntry as RawDocketEntry);

  const multiDocketedOn = formattedCaseDetail.consolidatedCases.filter(
    consolidatedCase =>
      consolidatedCase.docketNumber !== caseDetail.docketNumber &&
      formattedDocketEntry.multiDocketedOn.includes(
        consolidatedCase.docketNumber,
      ),
  );

  const showQCHelpText = DocketEntry.isMultiDocketed(formattedDocketEntry);

  return {
    formattedDocketEntry,
    showPaperServiceWarning,
    multiDocketedOn,
    showQCHelpText,
  };
};
