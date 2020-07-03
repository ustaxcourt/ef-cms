import { state } from 'cerebral';

export const draftDocumentViewerHelper = (get, applicationContext) => {
  const { USER_ROLES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const caseDetail = get(state.caseDetail);

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail,
    });

  const viewerDraftDocumentToDisplay = get(state.viewerDraftDocumentToDisplay);

  const formattedDocumentToDisplay =
    viewerDraftDocumentToDisplay &&
    formattedCaseDetail.draftDocuments &&
    formattedCaseDetail.draftDocuments.find(
      draftDocument =>
        draftDocument.documentId === viewerDraftDocumentToDisplay.documentId,
    );
  if (!formattedDocumentToDisplay) {
    return {
      createdByLabel: '',
      documentTitle: '',
    };
  }
  const createdByLabel = formattedDocumentToDisplay.filedBy
    ? `Created by ${formattedDocumentToDisplay.filedBy}`
    : '';

  const documentIsSigned =
    viewerDraftDocumentToDisplay && !!formattedDocumentToDisplay.signedAt;

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

  const showApplySignatureButtonForDocument = !documentIsSigned;
  const showEditSignatureButtonForDocument = documentIsSigned;

  return {
    createdByLabel,
    documentTitle: formattedDocumentToDisplay.documentTitle,
    showAddDocketEntryButton: showAddDocketEntryButtonForRole,
    showApplySignatureButton:
      showApplyEditSignatureButtonForRole &&
      showApplySignatureButtonForDocument,
    showEditButtonNotSigned: showEditButtonForRole && !documentIsSigned,
    showEditButtonSigned: showEditButtonForRole && documentIsSigned,
    showEditSignatureButton:
      showApplyEditSignatureButtonForRole && showEditSignatureButtonForDocument,
  };
};
