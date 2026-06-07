/* eslint-disable complexity */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';
import { getDocumentDisplayFlags } from './documentViewerHelper';

export const messageDocumentHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    EVENT_CODES_REQUIRING_SIGNATURE,
    GENERIC_ORDER_EVENT_CODE,
    NOTICE_EVENT_CODES,
    STIPULATED_DECISION_EVENT_CODE,
  } = applicationContext.getConstants();
  const user = get(state.user);
  const permissions = get(state.permissions);
  const caseDetail = get(state.caseDetail);
  const parentMessageId = get(state.parentMessageId);
  const viewerDocumentToDisplayDocumentId = get(
    state.messageViewerDocumentToDisplay.documentId,
  );

  if (!viewerDocumentToDisplayDocumentId) {
    return {};
  }

  // We use getAttachmentDocumentById instead of filtering based on getFormattedCaseDetail
  // (as we do in draftDocumentViewerHelper) to ensure we search over archived documents as well.
  const caseDocument =
    applicationContext.getUtilities().getAttachmentDocumentById({
      caseDetail,
      documentId: viewerDocumentToDisplayDocumentId,
      useArchived: true,
    }) || {};

  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const isDraftStampOrder =
    caseDocument.eventCode === GENERIC_ORDER_EVENT_CODE &&
    caseDocument.stampData?.disposition;

  const isStatusReportOrder = Object.values(
    STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions,
  ).includes(caseDocument?.draftOrderState?.orderType);

  const isNotice = NOTICE_EVENT_CODES.includes(caseDocument.eventCode);

  const isStipulatedDecision =
    caseDocument.eventCode === STIPULATED_DECISION_EVENT_CODE;

  const requiresSignature = EVENT_CODES_REQUIRING_SIGNATURE.includes(
    caseDocument.eventCode,
  );

  const isSigned = !!caseDocument.signedAt;
  const isCorrespondence = !!caseDocument.correspondenceId;
  const isNonCorrespondenceDraft = caseDocument.isDraft && !isCorrespondence;
  const isArchived = !!caseDocument.archived;

  const showEditButtonForRole = isInternalUser;
  const showEditButtonForDocument =
    isNonCorrespondenceDraft && !isStipulatedDecision;
  const showEditButtonSigned = isStatusReportOrder
    ? permissions.STATUS_REPORT_ORDER && isSigned
    : showEditButtonForRole &&
      showEditButtonForDocument &&
      isSigned &&
      !isNotice &&
      !isDraftStampOrder;
  const showEditButtonNotSigned = isStatusReportOrder
    ? permissions.STATUS_REPORT_ORDER && !isSigned
    : showEditButtonForRole &&
      showEditButtonForDocument &&
      (!isSigned || isNotice);

  const showAddDocumentEntryButtonForRole =
    permissions.CREATE_ORDER_DOCKET_ENTRY;
  const showAddDocketEntryButtonForDocument = isSigned || !requiresSignature;
  const showAddDocketEntryButton =
    showAddDocumentEntryButtonForRole &&
    showAddDocketEntryButtonForDocument &&
    isNonCorrespondenceDraft;

  const showApplySignatureButtonForRole = isInternalUser;
  const showApplySignatureButtonForDocument =
    !isSigned && isNonCorrespondenceDraft;
  const showApplySignatureButton =
    showApplySignatureButtonForRole && showApplySignatureButtonForDocument;

  const showApplyRemoveSignatureButtonForRole = isInternalUser;
  const showRemoveSignatureButtonForDocument =
    isSigned && !isNotice && !isStipulatedDecision && caseDocument.isDraft;
  const showRemoveSignatureButton =
    showApplyRemoveSignatureButtonForRole &&
    showRemoveSignatureButtonForDocument &&
    !isDraftStampOrder;

  const showDocumentNotSignedAlert =
    requiresSignature && !isSigned && !isArchived;

  const {
    showServePaperFiledDocumentButton,
    showServeCourtIssuedDocumentButton,
    showServePetitionButton,
    showStatusReportOrderButton,
    showOrderResponseButton,
    showSignStipulatedDecisionButton,
    showApplyStampButton,
    showServiceWarning,
    showLeadCaseNotification: showLeadCaseWarning,
  } = getDocumentDisplayFlags({
    document: caseDocument,
    permissions,
    caseDetail,
    isInternalUser,
  });

  const showEditButtonForCorrespondenceDocument =
    isCorrespondence && permissions.CASE_CORRESPONDENCE;
  const showEditCorrespondenceButton =
    showEditButtonForRole && showEditButtonForCorrespondenceDocument;

  const addDocketEntryLink = `/case-detail/${caseDetail.docketNumber}/documents/${viewerDocumentToDisplayDocumentId}/add-court-issued-docket-entry/${parentMessageId}`;
  const applySignatureLink = `/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDocumentToDisplayDocumentId}/sign/${parentMessageId}`;
  const applyStampFromMessagesLink = `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}/${viewerDocumentToDisplayDocumentId}/apply-stamp`;
  const editCorrespondenceLink = `/case-detail/${caseDetail.docketNumber}/edit-correspondence/${viewerDocumentToDisplayDocumentId}/${parentMessageId}`;
  const messageDetailLink = `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}`;
  const motionOrderResponseFromMessagesLink = `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}/${viewerDocumentToDisplayDocumentId}/motion-order-response-create`;
  const servePetitionLink = `/case-detail/${caseDetail.docketNumber}/petition-qc/${parentMessageId}`;
  const statusReportOrderFromMessagesLink = `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}/${viewerDocumentToDisplayDocumentId}/status-report-order-create`;
  return {
    addDocketEntryLink,
    applySignatureLink,
    applyStampFromMessagesLink,
    archived: isArchived,
    docketEntryId: caseDocument.docketEntryId,
    documentType: caseDocument.documentType,
    editCorrespondenceLink,
    filingDate: caseDocument.filingDate,
    index: caseDocument.index,
    messageDetailLink,
    motionOrderResponseFromMessagesLink,
    servePetitionLink,
    showAddDocketEntryButton,
    showApplySignatureButton,
    showApplyStampButton,
    showDocumentNotSignedAlert,
    showEditButtonNotSigned,
    showEditButtonSigned,
    showEditCorrespondenceButton,
    showOrderResponseButton,
    showRemoveSignatureButton,
    showServeCourtIssuedDocumentButton,
    showServePaperFiledDocumentButton,
    showServePetitionButton,
    showServiceWarning,
    showLeadCaseWarning,
    showSignStipulatedDecisionButton,
    showStatusReportOrderButton,
    statusReportOrderFromMessagesLink,
  };
};
