/* eslint-disable complexity */

import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { getShowNotServedForDocument } from './getShowNotServedForDocument';
import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { isLeadCase, isMemberCase } from '@shared/business/entities/cases/Case';
import {
  ALLOWLIST_FEATURE_FLAGS,
  ORDER_RESPONSE_DOCUMENTS_ALLOWLIST,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';

export const documentViewerHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    COURT_ISSUED_EVENT_CODES,
    PROPOSED_STIPULATED_DECISION_EVENT_CODE,
    STAMPED_DOCUMENTS_ALLOWLIST,
    STATUS_REPORT_ORDER_DOCUMENTS_ALLOWLIST,
    STIPULATED_DECISION_EVENT_CODE,
  } = applicationContext.getConstants();

  const permissions = get(state.permissions);
  const viewerDocumentToDisplay = get(state.viewerDocumentToDisplay);
  const caseDetail = get(state.caseDetail);
  const user = get(state.user);
  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      authorizedUser: user,
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
    caseDetail,
    docketEntryId: formattedDocumentToDisplay.docketEntryId,
    draftDocuments: formattedCaseDetail.draftDocuments,
  });

  const isSimultaneousDocType = Boolean(
    viewerDocumentToDisplay &&
    ((viewerDocumentToDisplay.eventCode &&
      SIMULTANEOUS_DOCUMENT_EVENT_CODES.includes(
        viewerDocumentToDisplay.eventCode,
      )) ||
      viewerDocumentToDisplay.documentTitle?.includes('Simultaneous')),
  );

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

  const restrictedEventCodes = get(
    state.featureFlags[ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key],
  );

  const isRestricted =
    restrictedEventCodes &&
    restrictedEventCodes?.includes(formattedDocumentToDisplay.eventCode);

  const isDocumentUnserved = () => {
    return showNotServed || !servedLabel;
  };

  const showCompleteQcButton =
    permissions.EDIT_DOCKET_ENTRY &&
    formattedDocumentToDisplay.qcNeeded &&
    !isRestricted;

  const showApplyStampButton =
    permissions.STAMP_MOTION &&
    STAMPED_DOCUMENTS_ALLOWLIST.includes(formattedDocumentToDisplay.eventCode);

  const showOrderResponseButton =
    permissions.MOTION_ORDER_RESPONSE &&
    ORDER_RESPONSE_DOCUMENTS_ALLOWLIST.includes(
      formattedDocumentToDisplay.eventCode,
    );

  const showServePaperFiledDocumentButton =
    canAllowDocumentServiceForCase &&
    showNotServed &&
    !isCourtIssuedDocument &&
    !formattedDocumentToDisplay.isPetition &&
    permissions.SERVE_DOCUMENT &&
    // If not a simultaneous doc, use normal logic
    (!isSimultaneousDocType ||
      // unconsolidated case
      (isSimultaneousDocType && !caseDetail.leadDocketNumber) ||
      // in lead case of group
      (isSimultaneousDocType && isLeadCase(caseDetail)) ||
      // in member case and not filed across group
      (isSimultaneousDocType &&
        isMemberCase(caseDetail) &&
        !DocketEntry.isMultiDocketed(formattedDocumentToDisplay)));

  const showLeadCaseBanner =
    isMemberCase(caseDetail) &&
    isSimultaneousDocType &&
    DocketEntry.isMultiDocketed(formattedDocumentToDisplay) &&
    isDocumentUnserved() &&
    permissions.SERVE_DOCUMENT;

  const showStatusReportOrderButton =
    permissions.STATUS_REPORT_ORDER &&
    STATUS_REPORT_ORDER_DOCUMENTS_ALLOWLIST.includes(
      formattedDocumentToDisplay.eventCode,
    );

  return {
    description: formattedDocumentToDisplay.descriptionDisplay,
    filedLabel,
    servedLabel,
    sealedToTooltip: formattedDocumentToDisplay.sealedToTooltip,
    showApplyStampButton,
    showOrderResponseButton,
    showCompleteQcButton,
    showNotServed,
    showSealed: formattedDocumentToDisplay.isSealed,
    showSealedInBlackstone: formattedDocumentToDisplay.isLegacySealed,
    showServeCourtIssuedDocumentButton,
    showServePaperFiledDocumentButton,
    showLeadCaseBanner,
    showServePetitionButton,
    showSignStipulatedDecisionButton,
    showStatusReportOrderButton,
    showStricken: !!formattedDocumentToDisplay.isStricken,
    showUnservedPetitionWarning,
  };
};
