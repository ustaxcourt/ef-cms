/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { getShowNotServedForDocument } from './getShowNotServedForDocument';

export const messageDocumentHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    COURT_ISSUED_EVENT_CODES,
    EVENT_CODES_REQUIRING_SIGNATURE,
    GENERIC_ORDER_EVENT_CODE,
    INITIAL_DOCUMENT_TYPES,
    NOTICE_EVENT_CODES,
    PROPOSED_STIPULATED_DECISION_EVENT_CODE,
    STAMPED_DOCUMENTS_ALLOWLIST,
    STATUS_REPORT_ORDER_DOCUMENTS_ALLOWLIST,
    STIPULATED_DECISION_EVENT_CODE,
  } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);
  const caseDetail = get(state.caseDetail);
  const parentMessageId = get(state.parentMessageId);

  const viewerDocumentToDisplayDocumentId = get(
    state.messageViewerDocumentToDisplay.documentId,
  );

  if (!viewerDocumentToDisplayDocumentId) {
    return {};
  }

  const canAllowDocumentServiceForCase = applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);

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
  const isPetitionDocument =
    caseDocument.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode;

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

  // It seems like we should be able to get formattedDocumentToDisplay like we do in draftDocumentViewerHelper
  // to avoid the duplication with caseDocument and formattedDocument in this file. However, we are using
  // slightly different properties to pull up caseDocument and formattedDocument. This may be unnecessary.
  // The variables affected by formattedDocument are showApplyStampButton and showStatusReportOrderButton.
  const { draftDocuments } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, caseDetail);
  const formattedDocument = draftDocuments.find(
    doc => doc.docketEntryId === viewerDocumentToDisplayDocumentId,
  );
  const showNotServed = getShowNotServedForDocument({
    caseDetail,
    docketEntryId: caseDocument.docketEntryId,
    draftDocuments,
  });

  const showApplyStampButton =
    permissions.STAMP_MOTION &&
    (STAMPED_DOCUMENTS_ALLOWLIST.includes(caseDocument.eventCode) ||
      STAMPED_DOCUMENTS_ALLOWLIST.includes(formattedDocument?.eventCode));

  const showStatusReportOrderButton =
    permissions.STATUS_REPORT_ORDER &&
    (STATUS_REPORT_ORDER_DOCUMENTS_ALLOWLIST.includes(caseDocument.eventCode) ||
      STATUS_REPORT_ORDER_DOCUMENTS_ALLOWLIST.includes(
        formattedDocument?.eventCode,
      ));

  const isCourtIssuedDocument = COURT_ISSUED_EVENT_CODES.map(
    ({ eventCode }) => eventCode,
  ).includes(caseDocument.eventCode);

  const showServeCourtIssuedDocumentButton =
    canAllowDocumentServiceForCase &&
    showNotServed &&
    isCourtIssuedDocument &&
    permissions.SERVE_DOCUMENT;

  const showServePaperFiledDocumentButton =
    canAllowDocumentServiceForCase &&
    showNotServed &&
    !isCourtIssuedDocument &&
    !isPetitionDocument &&
    permissions.SERVE_DOCUMENT;

  const showServiceWarning =
    !canAllowDocumentServiceForCase &&
    showNotServed &&
    !isPetitionDocument &&
    permissions.SERVE_DOCUMENT;

  const showServePetitionButton =
    showNotServed && isPetitionDocument && permissions.SERVE_PETITION;

  const showSignStipulatedDecisionButton =
    isInternalUser &&
    caseDocument.eventCode === PROPOSED_STIPULATED_DECISION_EVENT_CODE &&
    DocketEntry.isServed(caseDocument) &&
    !caseDetail.docketEntries.find(
      d => d.eventCode === STIPULATED_DECISION_EVENT_CODE && !d.archived,
    );

  const showEditButtonForCorrespondenceDocument =
    isCorrespondence && permissions.CASE_CORRESPONDENCE;
  const showEditCorrespondenceButton =
    showEditButtonForRole && showEditButtonForCorrespondenceDocument;

  const addDocketEntryLink = `/case-detail/${caseDetail.docketNumber}/documents/${viewerDocumentToDisplayDocumentId}/add-court-issued-docket-entry/${parentMessageId}`;
  const applySignatureLink = `/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDocumentToDisplayDocumentId}/sign/${parentMessageId}`;
  const applyStampFromMessagesLink = `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}/${viewerDocumentToDisplayDocumentId}/apply-stamp`;
  const editCorrespondenceLink = `/case-detail/${caseDetail.docketNumber}/edit-correspondence/${viewerDocumentToDisplayDocumentId}/${parentMessageId}`;
  const messageDetailLink = `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}`;
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
    servePetitionLink,
    showAddDocketEntryButton,
    showApplySignatureButton,
    showApplyStampButton,
    showDocumentNotSignedAlert,
    showEditButtonNotSigned,
    showEditButtonSigned,
    showEditCorrespondenceButton,
    showRemoveSignatureButton,
    showServeCourtIssuedDocumentButton,
    showServePaperFiledDocumentButton,
    showServePetitionButton,
    showServiceWarning,
    showSignStipulatedDecisionButton,
    showStatusReportOrderButton,
    statusReportOrderFromMessagesLink,
  };
};
