/* eslint-disable complexity */
import { getShowNotServedForDocument } from './getShowNotServedForDocument';
import { state } from 'cerebral';

export const messageDocumentHelper = (get, applicationContext) => {
  const viewerDocumentIdToDisplay = get(
    state.viewerDocumentToDisplay.documentId,
  );
  if (!viewerDocumentIdToDisplay) {
    return null;
  }

  const {
    COURT_ISSUED_EVENT_CODES,
    EVENT_CODES_REQUIRING_SIGNATURE,
    INITIAL_DOCUMENT_TYPES,
    NOTICE_EVENT_CODES,
    PROPOSED_STIPULATED_DECISION_EVENT_CODE,
    STIPULATED_DECISION_EVENT_CODE,
    UNSERVABLE_EVENT_CODES,
  } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);
  const caseDetail = get(state.caseDetail);

  const { docketEntries } = caseDetail;

  const caseDocument =
    applicationContext.getUtilities().getAttachmentDocumentById({
      caseDetail,
      documentId: viewerDocumentIdToDisplay,
      useArchived: true,
    }) || {};

  const isCorrespondence = !caseDocument.entityName;

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
    showNotServed && isCourtIssuedDocument && permissions.SERVE_DOCUMENT;

  const showServePaperFiledDocumentButton =
    showNotServed &&
    !isCourtIssuedDocument &&
    !isPetitionDocument &&
    permissions.SERVE_DOCUMENT;

  const showServePetitionButton =
    showNotServed && isPetitionDocument && permissions.SERVE_PETITION;

  const showSignStipulatedDecisionButton =
    isInternalUser &&
    caseDocument.eventCode === PROPOSED_STIPULATED_DECISION_EVENT_CODE &&
    caseDocument.servedAt &&
    !docketEntries.find(
      d => d.eventCode === STIPULATED_DECISION_EVENT_CODE && !d.archived,
    );

  return {
    archived: documentIsArchived,
    editUrl,
    showAddDocketEntryButton,
    showApplySignatureButton:
      showApplyRemoveSignatureButtonForRole &&
      showApplySignatureButtonForDocument,
    showDocumentNotSignedAlert,
    showEditButtonNotSigned:
      showEditButtonForRole &&
      showEditButtonForDocument &&
      (!documentIsSigned || isNotice),
    showEditButtonSigned:
      showEditButtonForRole &&
      showEditButtonForDocument &&
      documentIsSigned &&
      !isNotice,
    showEditCorrespondenceButton:
      showEditButtonForRole && showEditButtonForCorrespondenceDocument,
    showNotServed,
    showRemoveSignatureButton:
      showApplyRemoveSignatureButtonForRole &&
      showRemoveSignatureButtonForDocument,
    showServeCourtIssuedDocumentButton,
    showServePaperFiledDocumentButton,
    showServePetitionButton,
    showSignStipulatedDecisionButton,
  };
};
