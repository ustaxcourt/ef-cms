import { getShowNotServedForDocument } from './getShowNotServedForDocument';
import { state } from 'cerebral';

export const messageDocumentHelper = (get, applicationContext) => {
  const {
    COURT_ISSUED_DOCUMENT_TYPES,
    EVENT_CODES_REQUIRING_SIGNATURE,
    INITIAL_DOCUMENT_TYPES,
    NOTICE_EVENT_CODES,
    PROPOSED_STIPULATED_DECISION_EVENT_CODE,
    STIPULATED_DECISION_EVENT_CODE,
    UNSERVABLE_EVENT_CODES,
  } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);
  const viewerDocumentToDisplay = get(state.viewerDocumentToDisplay);
  const caseDetail = get(state.caseDetail);

  if (!viewerDocumentToDisplay) {
    return null;
  }

  const { correspondence, documents } = caseDetail;

  const caseDocument =
    [...correspondence, ...documents].find(
      d => d.documentId === viewerDocumentToDisplay.documentId,
    ) || {};

  const isCorrespondence = !caseDocument.entityName; // TODO: Sure this up a little

  const documentRequiresSignature = EVENT_CODES_REQUIRING_SIGNATURE.includes(
    caseDocument.eventCode,
  );

  const documentIsSigned = !!caseDocument.signedAt;

  const { draftDocuments } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, caseDetail);

  let editUrl = '';
  const formattedDocument = draftDocuments.find(
    doc => doc.documentId === viewerDocumentToDisplay.documentId,
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

  const showAddDocketEntryButtonForRole = hasDocketEntryPermission;
  const showEditButtonForRole = isInternalUser;
  const showApplyRemoveSignatureButtonForRole = isInternalUser;

  const showAddDocketEntryButtonForDocument =
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
  const showEditButtonForCorrespondenceDocument = isCorrespondence;

  const showDocumentNotSignedAlert =
    documentRequiresSignature && !documentIsSigned;

  const showNotServed = getShowNotServedForDocument({
    UNSERVABLE_EVENT_CODES,
    caseDetail,
    documentId: caseDocument.documentId,
    draftDocuments,
  });

  const isCourtIssuedDocument = COURT_ISSUED_DOCUMENT_TYPES.includes(
    caseDocument.documentType,
  );

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
    !documents.find(d => d.eventCode === STIPULATED_DECISION_EVENT_CODE);

  return {
    editUrl,
    showAddDocketEntryButton:
      showAddDocketEntryButtonForRole && showAddDocketEntryButtonForDocument,
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
