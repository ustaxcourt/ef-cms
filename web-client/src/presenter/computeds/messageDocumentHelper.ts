/* eslint-disable complexity */

import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { getShowNotServedForDocument } from './getShowNotServedForDocument';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const messageDocumentHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const viewerDocumentIdToDisplay = get(
    state.messageViewerDocumentToDisplay.documentId,
  );

  if (!viewerDocumentIdToDisplay) {
    return {};
  }

  const {
    COURT_ISSUED_EVENT_CODES,
    EVENT_CODES_REQUIRING_SIGNATURE,
    GENERIC_ORDER_EVENT_CODE,
    INITIAL_DOCUMENT_TYPES,
    NOTICE_EVENT_CODES,
    PROPOSED_STIPULATED_DECISION_EVENT_CODE,
    STAMPED_DOCUMENTS_ALLOWLIST,
    STIPULATED_DECISION_EVENT_CODE,
    UNSERVABLE_EVENT_CODES,
  } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);
  const caseDetail = get(state.caseDetail);
  const parentMessageId = get(state.parentMessageId);

  const canAllowDocumentServiceForCase = applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);

  const { docketEntries } = caseDetail;

  const caseDocument =
    applicationContext.getUtilities().getAttachmentDocumentById({
      caseDetail,
      documentId: viewerDocumentIdToDisplay,
      useArchived: true,
    }) || {};

  const isCorrespondence = !!caseDocument.correspondenceId;

  const documentRequiresSignature = EVENT_CODES_REQUIRING_SIGNATURE.includes(
    caseDocument.eventCode,
  );

  const documentIsSigned = !!caseDocument.signedAt;

  const documentIsArchived = !!caseDocument.archived;

  const { draftDocuments } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, caseDetail);

  let editUrl = '';
  const formattedDocument = draftDocuments.find(
    doc => doc.docketEntryId === viewerDocumentIdToDisplay,
  );

  if (formattedDocument) {
    ({ editUrl } = formattedDocument);
    editUrl += `/${parentMessageId}`;
  }

  const isNotice = NOTICE_EVENT_CODES.includes(caseDocument.eventCode);

  const isPetitionDocument =
    caseDocument.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode;

  const isStipulatedDecision =
    caseDocument.eventCode === STIPULATED_DECISION_EVENT_CODE;

  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const hasDocketEntryPermission = permissions.CREATE_ORDER_DOCKET_ENTRY;
  const hasEditCorrespondencePermission = permissions.CASE_CORRESPONDENCE;

  const showEditButtonForRole = isInternalUser;
  const showApplyRemoveSignatureButtonForRole = isInternalUser;

  const showAddDocketEntryButton =
    hasDocketEntryPermission &&
    !isCorrespondence &&
    caseDocument.isDraft &&
    (documentIsSigned || !documentRequiresSignature);
  const showApplySignatureButtonForDocument =
    !isCorrespondence && !documentIsSigned && caseDocument.isDraft;
  const showEditButtonForDocument =
    caseDocument.isDraft && !isCorrespondence && !isStipulatedDecision;
  const isDraftStampOrder =
    caseDocument.eventCode === GENERIC_ORDER_EVENT_CODE &&
    caseDocument.stampData?.disposition;

  const showEditButtonSigned =
    showEditButtonForRole &&
    showEditButtonForDocument &&
    documentIsSigned &&
    !isNotice &&
    !isDraftStampOrder;
  const showRemoveSignatureButtonForDocument =
    documentIsSigned &&
    caseDocument.isDraft &&
    !isNotice &&
    !isStipulatedDecision;
  const showEditButtonForCorrespondenceDocument =
    isCorrespondence && hasEditCorrespondencePermission;

  const showDocumentNotSignedAlert =
    documentRequiresSignature && !documentIsSigned && !documentIsArchived;

  const showNotServed = getShowNotServedForDocument({
    UNSERVABLE_EVENT_CODES,
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
    !docketEntries.find(
      d => d.eventCode === STIPULATED_DECISION_EVENT_CODE && !d.archived,
    );

  const showApplyStampButton =
    permissions.STAMP_MOTION &&
    (STAMPED_DOCUMENTS_ALLOWLIST.includes(caseDocument.eventCode) ||
      STAMPED_DOCUMENTS_ALLOWLIST.includes(formattedDocument?.eventCode));

  return {
    addDocketEntryLink: `/case-detail/${caseDetail.docketNumber}/documents/${viewerDocumentIdToDisplay}/add-court-issued-docket-entry/${parentMessageId}`,
    applyStampFromMessagesLink: `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}/${viewerDocumentIdToDisplay}/apply-stamp`,
    archived: documentIsArchived,
    editCorrespondenceLink: `/case-detail/${caseDetail.docketNumber}/edit-correspondence/${viewerDocumentIdToDisplay}/${parentMessageId}`,
    editUrl,
    messageDetailLink: `/messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}`,
    servePetitionLink: `/case-detail/${caseDetail.docketNumber}/petition-qc/${parentMessageId}`,
    showAddDocketEntryButton,
    showApplySignatureButton:
      showApplyRemoveSignatureButtonForRole &&
      showApplySignatureButtonForDocument,
    showApplyStampButton,
    showDocumentNotSignedAlert,
    showEditButtonNotSigned:
      showEditButtonForRole &&
      showEditButtonForDocument &&
      (!documentIsSigned || isNotice),
    showEditButtonSigned,
    showEditCorrespondenceButton:
      showEditButtonForRole && showEditButtonForCorrespondenceDocument,
    showRemoveSignatureButton:
      showApplyRemoveSignatureButtonForRole &&
      showRemoveSignatureButtonForDocument &&
      !isDraftStampOrder,
    showServeCourtIssuedDocumentButton,
    showServePaperFiledDocumentButton,
    showServePetitionButton,
    showServiceWarning,
    showSignStipulatedDecisionButton,
    signOrderLink: `/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDocumentIdToDisplay}/sign/${parentMessageId}`,
  };
};
