import { state } from 'cerebral';

export const messageDocumentHelper = (get, applicationContext) => {
  const { USER_ROLES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const attachmentDocumentToDisplay = get(state.attachmentDocumentToDisplay);
  const caseDetail = get(state.caseDetail);

  const caseDocument =
    attachmentDocumentToDisplay &&
    caseDetail.documents.find(
      d => d.documentId === attachmentDocumentToDisplay.documentId,
    );

  const documentIsSigned =
    attachmentDocumentToDisplay && !!caseDocument.signedAt;

  const isDocumentOnDocketRecord =
    attachmentDocumentToDisplay &&
    caseDetail.docketRecord.find(
      docketEntry =>
        docketEntry.documentId === attachmentDocumentToDisplay.documentId,
    );

  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const isDocketPetitionsClerkRole = [
    USER_ROLES.clerkOfCourt,
    USER_ROLES.docketClerk,
    USER_ROLES.petitionsClerk,
  ].includes(user.role);

  const showAddDocketEntryButtonForRole = isDocketPetitionsClerkRole;
  const showEditButtonForRole = isInternalUser;
  const showApplyEditSignatureButtonForRole = isInternalUser;

  const showAddDocketEntryButtonForDocument = !isDocumentOnDocketRecord;
  const showApplySignatureButtonForDocument =
    !documentIsSigned && !isDocumentOnDocketRecord;
  const showEditSignatureButtonForDocument =
    documentIsSigned && !isDocumentOnDocketRecord;
  const showEditButtonForDocument = !isDocumentOnDocketRecord;

  return {
    showAddDocketEntryButton:
      showAddDocketEntryButtonForRole && showAddDocketEntryButtonForDocument,
    showApplySignatureButton:
      showApplyEditSignatureButtonForRole &&
      showApplySignatureButtonForDocument,
    showEditButtonNotSigned:
      showEditButtonForRole && showEditButtonForDocument && !documentIsSigned,
    showEditButtonSigned:
      showEditButtonForRole && showEditButtonForDocument && documentIsSigned,
    showEditSignatureButton:
      showApplyEditSignatureButtonForRole && showEditSignatureButtonForDocument,
  };
};
