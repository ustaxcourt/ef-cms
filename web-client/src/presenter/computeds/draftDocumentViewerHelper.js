import { state } from 'cerebral';

export const draftDocumentViewerHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);
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

  const hasDocketEntryPermission = permissions.CREATE_ORDER_DOCKET_ENTRY;

  const showAddDocketEntryButtonForRole = hasDocketEntryPermission;
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
