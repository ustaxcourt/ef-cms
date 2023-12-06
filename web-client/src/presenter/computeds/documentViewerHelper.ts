/* eslint-disable complexity */

import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { getShowNotServedForDocument } from './getShowNotServedForDocument';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const documentViewerHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    COURT_ISSUED_EVENT_CODES,
    PROPOSED_STIPULATED_DECISION_EVENT_CODE,
    STAMPED_DOCUMENTS_ALLOWLIST,
    STIPULATED_DECISION_EVENT_CODE,
    UNSERVABLE_EVENT_CODES,
  } = applicationContext.getConstants();

  const permissions = get(state.permissions);
  const viewerDocumentToDisplay = get(state.viewerDocumentToDisplay);
  const caseDetail = get(state.caseDetail);

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail,
    });

  const canAllowDocumentServiceForCase = !!applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);

  const formattedDocumentToDisplay =
    viewerDocumentToDisplay &&
    formattedCaseDetail.formattedDocketEntries.find(
      entry =>
        entry && entry.docketEntryId === viewerDocumentToDisplay.docketEntryId,
    );

  if (!formattedDocumentToDisplay) {
    return {};
  }

  const filedLabel = formattedDocumentToDisplay.filedBy
    ? `Filed ${formattedDocumentToDisplay.createdAtFormatted} by ${formattedDocumentToDisplay.filedBy}`
    : '';

  const { servedAtFormatted } = formattedDocumentToDisplay;
  const servedLabel = servedAtFormatted ? `Served ${servedAtFormatted}` : '';

  const showNotServed = getShowNotServedForDocument({
    UNSERVABLE_EVENT_CODES,
    caseDetail,
    docketEntryId: formattedDocumentToDisplay.docketEntryId,
    draftDocuments: formattedCaseDetail.draftDocuments,
  });

  const isCourtIssuedDocument = COURT_ISSUED_EVENT_CODES.map(
    ({ eventCode }) => eventCode,
  ).includes(formattedDocumentToDisplay.eventCode);

  const showServeCourtIssuedDocumentButton =
    canAllowDocumentServiceForCase &&
    showNotServed &&
    isCourtIssuedDocument &&
    permissions.SERVE_DOCUMENT;

  const showUnservedPetitionWarning =
    !canAllowDocumentServiceForCase &&
    showNotServed &&
    !formattedDocumentToDisplay.isPetition &&
    permissions.SERVE_DOCUMENT;

  const showServePaperFiledDocumentButton =
    canAllowDocumentServiceForCase &&
    showNotServed &&
    !isCourtIssuedDocument &&
    !formattedDocumentToDisplay.isPetition &&
    permissions.SERVE_DOCUMENT;

  const showServePetitionButton =
    showNotServed &&
    formattedDocumentToDisplay.isPetition &&
    permissions.SERVE_PETITION;

  const showSignStipulatedDecisionButton =
    formattedDocumentToDisplay.eventCode ===
      PROPOSED_STIPULATED_DECISION_EVENT_CODE &&
    DocketEntry.isServed(formattedDocumentToDisplay) &&
    !formattedCaseDetail.docketEntries.find(
      d => d.eventCode === STIPULATED_DECISION_EVENT_CODE && !d.archived,
    );

  const showCompleteQcButton =
    permissions.EDIT_DOCKET_ENTRY && formattedDocumentToDisplay.qcNeeded;

  const showApplyStampButton =
    permissions.STAMP_MOTION &&
    STAMPED_DOCUMENTS_ALLOWLIST.includes(formattedDocumentToDisplay.eventCode);

  return {
    description: formattedDocumentToDisplay.descriptionDisplay,
    filedLabel,
    servedLabel,
    showApplyStampButton,
    showCompleteQcButton,
    showNotServed,
    showSealedInBlackstone: formattedDocumentToDisplay.isLegacySealed,
    showServeCourtIssuedDocumentButton,
    showServePaperFiledDocumentButton,
    showServePetitionButton,
    showSignStipulatedDecisionButton,
    showStricken: !!formattedDocumentToDisplay.isStricken,
    showUnservedPetitionWarning,
  };
};
