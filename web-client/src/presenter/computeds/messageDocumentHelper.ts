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
  // Get constants and details from state
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

  // Get the document from which the following business logic is derived
  // TODO consistently rename variable below
  const viewerDocumentIdToDisplay = get(
    state.messageViewerDocumentToDisplay.documentId,
  );

  if (!viewerDocumentIdToDisplay) {
    return {};
  }

  const canAllowDocumentServiceForCase = applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);

  const caseDocument =
    applicationContext.getUtilities().getAttachmentDocumentById({
      caseDetail,
      documentId: viewerDocumentIdToDisplay,
      useArchived: true,
    }) || {};

  // Business logic
  const documentRequiresSignature = EVENT_CODES_REQUIRING_SIGNATURE.includes(
    caseDocument.eventCode,
  );

  const isNotice = NOTICE_EVENT_CODES.includes(caseDocument.eventCode);

  const isStipulatedDecision =
    caseDocument.eventCode === STIPULATED_DECISION_EVENT_CODE;

  const documentIsSigned = !!caseDocument.signedAt;

  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const hasDocketEntryPermission = permissions.CREATE_ORDER_DOCKET_ENTRY;

  const showEditButtonForRole = isInternalUser;

  const showApplyRemoveSignatureButtonForRole = isInternalUser;

  const isDraftStampOrder =
    caseDocument.eventCode === GENERIC_ORDER_EVENT_CODE &&
    caseDocument.stampData?.disposition;

  const isStatusReportOrder = Object.values(
    STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions,
  ).includes(caseDocument?.draftOrderState?.orderType);

  // begin message-specific variables
  const isCorrespondence = !!caseDocument.correspondenceId;
  const documentIsArchived = !!caseDocument.archived;
  const isPetitionDocument =
    caseDocument.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode;
  const hasEditCorrespondencePermission = permissions.CASE_CORRESPONDENCE;
  const showEditButtonForDocument =
    caseDocument.isDraft && !isCorrespondence && !isStipulatedDecision;
  const showEditButtonForCorrespondenceDocument =
    isCorrespondence && hasEditCorrespondencePermission;
  // end message-specific variables

  // Derive button state
  const showEditButtonSigned = isStatusReportOrder
    ? permissions.STATUS_REPORT_ORDER && documentIsSigned
    : showEditButtonForRole &&
      showEditButtonForDocument &&
      documentIsSigned &&
      !isNotice &&
      !isDraftStampOrder;

  const showEditButtonNotSigned = isStatusReportOrder
    ? permissions.STATUS_REPORT_ORDER && !documentIsSigned
    : showEditButtonForRole &&
      showEditButtonForDocument &&
      (!documentIsSigned || isNotice);

  // TODO: rename this variable to match draftDocumentViewerHelper.ts
  const showAddDocketEntryButton =
    hasDocketEntryPermission &&
    !isCorrespondence &&
    caseDocument.isDraft &&
    (documentIsSigned || !documentRequiresSignature);

  const showApplySignatureButtonForDocument =
    !isCorrespondence && !documentIsSigned && caseDocument.isDraft;

  const showApplySignatureButton =
    showApplyRemoveSignatureButtonForRole &&
    showApplySignatureButtonForDocument;

  const showRemoveSignatureButtonForDocument =
    documentIsSigned &&
    caseDocument.isDraft &&
    !isNotice &&
    !isStipulatedDecision;

  const showRemoveSignatureButton =
    showApplyRemoveSignatureButtonForRole &&
    showRemoveSignatureButtonForDocument &&
    !isDraftStampOrder;

  const showDocumentNotSignedAlert =
    documentRequiresSignature && !documentIsSigned && !documentIsArchived;

  // Derive message-specific button state

  // Begin formattedDocument retrieval
  const { draftDocuments } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, caseDetail);

  // TODO: Why do we need formattedDocument if we have caseDocument??
  const formattedDocument = draftDocuments.find(
    doc => doc.docketEntryId === viewerDocumentIdToDisplay,
  );
  // End formattedDocument retrieval

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

  const showNotServed = getShowNotServedForDocument({
    caseDetail,
    docketEntryId: caseDocument.docketEntryId,
    draftDocuments,
  });

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
    !isPetitionDocument &&
    !canAllowDocumentServiceForCase &&
    showNotServed &&
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

  const showEditCorrespondenceButton =
    showEditButtonForRole && showEditButtonForCorrespondenceDocument;

  // Links definition
  const addDocketEntryLink = `/case-detail/${caseDetail.docketNumber}/documents/${viewerDocumentIdToDisplay}/add-court-issued-docket-entry/${parentMessageId}`;
  // TODO: rename signOrderLink so that its name corresponds to whatever the final name of the applySignatureLink is in draftDocumentViewerHelper.ts
  const signOrderLink = `/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDocumentIdToDisplay}/sign/${parentMessageId}`;
  const applyStampFromMessagesLink = `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}/${viewerDocumentIdToDisplay}/apply-stamp`;
  const editCorrespondenceLink = `/case-detail/${caseDetail.docketNumber}/edit-correspondence/${viewerDocumentIdToDisplay}/${parentMessageId}`;
  const messageDetailLink = `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}`;
  const servePetitionLink = `/case-detail/${caseDetail.docketNumber}/petition-qc/${parentMessageId}`;
  const statusReportOrderFromMessagesLink = `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}/${viewerDocumentIdToDisplay}/status-report-order-create`;

  return {
    addDocketEntryLink,
    applyStampFromMessagesLink,
    archived: documentIsArchived,
    editCorrespondenceLink,
    filingDate: caseDocument.filingDate,
    formattedDocument,
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
    signOrderLink,
    statusReportOrderFromMessagesLink,
  };
};
