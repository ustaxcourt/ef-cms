import { state } from 'cerebral';

export const messageDocumentHelper = (get, applicationContext) => {
  const { EVENT_CODES_REQUIRING_SIGNATURE } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);
  const viewerDocumentToDisplay = get(state.viewerDocumentToDisplay);
  const caseDetail = get(state.caseDetail);

  const caseDocument =
    viewerDocumentToDisplay &&
    caseDetail.documents.find(
      d => d.documentId === viewerDocumentToDisplay.documentId,
    );

  const documentRequiresSignature =
    caseDocument &&
    EVENT_CODES_REQUIRING_SIGNATURE.includes(caseDocument.eventCode);

  const documentIsSigned = viewerDocumentToDisplay && !!caseDocument.signedAt;

  const isDocumentOnDocketRecord =
    viewerDocumentToDisplay &&
    caseDetail.docketRecord.find(
      docketEntry =>
        docketEntry.documentId === viewerDocumentToDisplay.documentId,
    );

  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const hasDocketEntryPermission = permissions.CREATE_ORDER_DOCKET_ENTRY;

  const showAddDocketEntryButtonForRole = hasDocketEntryPermission;
  const showEditButtonForRole = isInternalUser;
  const showApplyEditSignatureButtonForRole = isInternalUser;

  const showAddDocketEntryButtonForDocument =
    !isDocumentOnDocketRecord &&
    (documentIsSigned || !documentRequiresSignature);
  const showApplySignatureButtonForDocument =
    !documentIsSigned && !isDocumentOnDocketRecord;
  const showEditSignatureButtonForDocument =
    documentIsSigned && !isDocumentOnDocketRecord;
  const showEditButtonForDocument = !isDocumentOnDocketRecord;

  const showDocumentNotSignedAlert =
    documentRequiresSignature && !documentIsSigned;

  return {
    showAddDocketEntryButton:
      showAddDocketEntryButtonForRole && showAddDocketEntryButtonForDocument,
    showApplySignatureButton:
      showApplyEditSignatureButtonForRole &&
      showApplySignatureButtonForDocument,
    showDocumentNotSignedAlert,
    showEditButtonNotSigned:
      showEditButtonForRole && showEditButtonForDocument && !documentIsSigned,
    showEditButtonSigned:
      showEditButtonForRole && showEditButtonForDocument && documentIsSigned,
    showEditSignatureButton:
      showApplyEditSignatureButtonForRole && showEditSignatureButtonForDocument,
  };
};
