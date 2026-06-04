/* eslint-disable complexity */
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { getShowNotServedForDocument } from './getShowNotServedForDocument';
import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import {
  canAllowDocumentServiceForCase,
  isLeadCase,
  isMemberCase,
} from '@shared/business/entities/cases/Case';
import {
  ALLOWLIST_FEATURE_FLAGS,
  COURT_ISSUED_EVENT_CODES,
  INITIAL_DOCUMENT_TYPES,
  ORDER_RESPONSE_DOCUMENTS_ALLOWLIST,
  PROPOSED_STIPULATED_DECISION_EVENT_CODE,
  STAMPED_DOCUMENTS_ALLOWLIST,
  STATUS_REPORT_ORDER_DOCUMENTS_ALLOWLIST,
  STIPULATED_DECISION_EVENT_CODE,
} from '@shared/business/entities/EntityConstants';

export const documentViewerHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
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
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

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

  const restrictedEventCodes = get(
    state.featureFlags[ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key],
  );

  const isRestricted =
    restrictedEventCodes &&
    restrictedEventCodes?.includes(formattedDocumentToDisplay.eventCode);

  const showCompleteQcButton =
    permissions.EDIT_DOCKET_ENTRY &&
    formattedDocumentToDisplay.qcNeeded &&
    !isRestricted;

  const {
    showServePaperFiledDocumentButton,
    showServeCourtIssuedDocumentButton,
    showServePetitionButton,
    showStatusReportOrderButton,
    showOrderResponseButton,
    showSignStipulatedDecisionButton,
    showApplyStampButton,
    showNotServed,
    showServiceWarning: showUnservedPetitionWarning,
    showLeadCaseNotification: showLeadCaseBanner,
  } = getDocumentDisplayFlags({
    document: formattedDocumentToDisplay,
    permissions,
    caseDetail,
    isInternalUser,
  });

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

export const getDocumentDisplayFlags = ({
  document,
  permissions,
  caseDetail,
  isInternalUser,
}) => {
  const showNotServed = getShowNotServedForDocument({
    caseDetail,
    docketEntryId: document.docketEntryId,
  });

  const isDocumentUnserved = showNotServed || !document.servedAt;
  const isPetitionDocument =
    document.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode;
  const isCourtIssuedDocument = COURT_ISSUED_EVENT_CODES.map(
    ({ eventCode }) => eventCode,
  ).includes(document.eventCode);

  const canAllowDocumentService = canAllowDocumentServiceForCase(caseDetail);

  const showServePaperFiledDocumentButton =
    canAllowDocumentService &&
    showNotServed &&
    !isCourtIssuedDocument &&
    !isPetitionDocument &&
    permissions.SERVE_DOCUMENT &&
    (!caseDetail.leadDocketNumber ||
      isLeadCase(caseDetail) ||
      (isMemberCase(caseDetail) && !DocketEntry.isMultiDocketed(document)));

  const showServeCourtIssuedDocumentButton =
    canAllowDocumentService &&
    showNotServed &&
    isCourtIssuedDocument &&
    permissions.SERVE_DOCUMENT &&
    (!caseDetail.leadDocketNumber ||
      isLeadCase(caseDetail) ||
      (isMemberCase(caseDetail) && !DocketEntry.isMultiDocketed(document)));

  const showServePetitionButton =
    showNotServed && isPetitionDocument && permissions.SERVE_PETITION;

  const showStatusReportOrderButton =
    permissions.STATUS_REPORT_ORDER &&
    STATUS_REPORT_ORDER_DOCUMENTS_ALLOWLIST.includes(document.eventCode);

  const showOrderResponseButton =
    permissions.MOTION_ORDER_RESPONSE &&
    ORDER_RESPONSE_DOCUMENTS_ALLOWLIST.includes(document.eventCode);

  const showSignStipulatedDecisionButton =
    isInternalUser &&
    document.eventCode === PROPOSED_STIPULATED_DECISION_EVENT_CODE &&
    DocketEntry.isServed(document) &&
    !caseDetail.docketEntries.find(
      d => d.eventCode === STIPULATED_DECISION_EVENT_CODE && !d.archived,
    );

  const showApplyStampButton =
    permissions.STAMP_MOTION &&
    STAMPED_DOCUMENTS_ALLOWLIST.includes(document.eventCode);

  const showServiceWarning =
    !canAllowDocumentService &&
    showNotServed &&
    !isPetitionDocument &&
    permissions.SERVE_DOCUMENT;

  const showLeadCaseNotification =
    isMemberCase(caseDetail) &&
    DocketEntry.isMultiDocketed(document) &&
    isDocumentUnserved &&
    !DocketEntry.isUnservable(document) &&
    permissions.SERVE_DOCUMENT;

  return {
    showServePaperFiledDocumentButton,
    showServeCourtIssuedDocumentButton,
    showServePetitionButton,
    showApplyStampButton,
    showStatusReportOrderButton,
    showOrderResponseButton,
    showSignStipulatedDecisionButton,
    showServiceWarning,
    showLeadCaseNotification,
    showNotServed,
  };
};
