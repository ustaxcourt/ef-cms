import { getShowNotServedForDocument } from './getShowNotServedForDocument';
import { state } from 'cerebral';

export const messageDocumentHelper = (get, applicationContext) => {
  const {
    COURT_ISSUED_DOCUMENT_TYPES,
    EVENT_CODES_REQUIRING_SIGNATURE,
    INITIAL_DOCUMENT_TYPES,
    NOTICE_EVENT_CODES,
    UNSERVABLE_EVENT_CODES,
  } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);
  const viewerDocumentToDisplay = get(state.viewerDocumentToDisplay);
  const caseDetail = get(state.caseDetail);

  const { correspondence, documents } = caseDetail;

  const caseDocument =
    (viewerDocumentToDisplay &&
      [...correspondence, ...documents].find(
        d => d.documentId === viewerDocumentToDisplay.documentId,
      )) ||
    {};

  const isCorrespondence = !caseDocument.entityName; // TODO: Sure this up a little

  const documentRequiresSignature = EVENT_CODES_REQUIRING_SIGNATURE.includes(
    caseDocument.eventCode,
  );

  const documentIsSigned = viewerDocumentToDisplay && !!caseDocument.signedAt;

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

  const isNotice =
    viewerDocumentToDisplay &&
    NOTICE_EVENT_CODES.includes(caseDocument.eventCode);

  const isPetitionDocument =
    caseDocument &&
    caseDocument.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode;

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
  const showEditButtonForDocument = caseDocument.isDraft && !isCorrespondence;
  const showRemoveSignatureButtonForDocument =
    documentIsSigned && caseDocument.isDraft && !isNotice;
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
  };
};
