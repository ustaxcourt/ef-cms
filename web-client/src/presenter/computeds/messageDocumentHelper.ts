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
  const viewerDocumentToDisplayDocumentId = get(
    state.messageViewerDocumentToDisplay.documentId,
  );

  if (!viewerDocumentToDisplayDocumentId) {
    return {};
  }

  const canAllowDocumentServiceForCase = applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);

  const caseDocument =
    applicationContext.getUtilities().getAttachmentDocumentById({
      caseDetail,
      documentId: viewerDocumentToDisplayDocumentId,
      useArchived: true,
    }) || {};

  // Business logic
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

  const documentRequiresSignature = EVENT_CODES_REQUIRING_SIGNATURE.includes(
    caseDocument.eventCode,
  );
  const documentIsSigned = !!caseDocument.signedAt;

  // begin message-specific variables
  const isCorrespondence = !!caseDocument.correspondenceId;
  const isNonCorrespondenceDraft = caseDocument.isDraft && !isCorrespondence;
  const documentIsArchived = !!caseDocument.archived;
  const isPetitionDocument =
    caseDocument.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode;
  // end message-specific variables

  // Derive button state
  const showEditButtonForRole = isInternalUser;
  const showEditButtonForDocument =
    isNonCorrespondenceDraft && !isStipulatedDecision;
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

  const showAddDocketEntryButtonForDocument =
    documentIsSigned || !documentRequiresSignature;
  const showAddDocketEntryButton =
    permissions.CREATE_ORDER_DOCKET_ENTRY &&
    showAddDocketEntryButtonForDocument &&
    isNonCorrespondenceDraft;

  const showApplySignatureButtonForRole = isInternalUser;
  const showApplySignatureButtonForDocument =
    !documentIsSigned && isNonCorrespondenceDraft;
  const showApplySignatureButton =
    showApplySignatureButtonForRole && showApplySignatureButtonForDocument;

  const showApplyRemoveSignatureButtonForRole = isInternalUser;
  const showRemoveSignatureButtonForDocument =
    documentIsSigned &&
    !isNotice &&
    !isStipulatedDecision &&
    caseDocument.isDraft;
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
    doc => doc.docketEntryId === viewerDocumentToDisplayDocumentId,
  );
  // End formattedDocument retrieval
  // Using the two variables from the formattedDocument retrieval above
  const showNotServed = getShowNotServedForDocument({
    caseDetail,
    docketEntryId: caseDocument.docketEntryId,
    draftDocuments,
  });

  console.log('caseDocument.eventCode', caseDocument.eventCode);
  console.log('formattedDocument.eventCode', formattedDocument?.eventCode);

  console.log('caseDocument.docketEntryId', caseDocument.docketEntryId);
  console.log(
    'formattedDocument.docketEntryId',
    formattedDocument?.docketEntryId,
  );

  console.log('caseDocument.documentType', caseDocument.documentType);
  console.log(
    'formattedDocument.documentType',
    formattedDocument?.documentType,
  );

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

  const showEditButtonForCorrespondenceDocument =
    isCorrespondence && permissions.CASE_CORRESPONDENCE;
  const showEditCorrespondenceButton =
    showEditButtonForRole && showEditButtonForCorrespondenceDocument;

  // Links definition
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
    statusReportOrderFromMessagesLink,
  };
};
