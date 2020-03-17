import { state } from 'cerebral';

export const caseDetailHeaderHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const caseDetail = get(state.caseDetail);
  const permissions = get(state.permissions);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const pendingAssociation = get(state.screenMetadata.pendingAssociation);
  const caseHasRespondent =
    !!caseDetail &&
    !!caseDetail.irsPractitioners &&
    !!caseDetail.irsPractitioners.length;
  const currentPage = get(state.currentPage);
  const isRequestAccessForm = currentPage === 'RequestAccessWizard';

  const isCaseSealed = !!caseDetail.isSealed;

  let showRequestAccessToCaseButton = false;
  let showPendingAccessToCaseButton = false;
  let showFileFirstDocumentButton = false;

  if (isExternalUser && !userAssociatedWithCase) {
    if (user.role === USER_ROLES.privatePractitioner) {
      showRequestAccessToCaseButton =
        !pendingAssociation && !isRequestAccessForm && !isCaseSealed;
      showPendingAccessToCaseButton = pendingAssociation;
    } else if (user.role === USER_ROLES.irsPractitioner) {
      showFileFirstDocumentButton = !caseHasRespondent && !isCaseSealed;
      showRequestAccessToCaseButton =
        caseHasRespondent && !isRequestAccessForm && !isCaseSealed;
    }
  }

  const showConsolidatedCaseIcon = !!caseDetail.leadCaseId;

  const showCreateOrderButton = permissions.COURT_ISSUED_DOCUMENT;

  const showAddDocketEntryButton = permissions.DOCKET_ENTRY;

  const showCaseDetailHeaderMenu = !isExternalUser;

  const showFileDocumentButton =
    permissions.FILE_EXTERNAL_DOCUMENT && userAssociatedWithCase;

  return {
    hidePublicCaseInformation: !isExternalUser,
    showAddDocketEntryButton,
    showCaseDetailHeaderMenu,
    showConsolidatedCaseIcon,
    showCreateOrderButton,
    showEditCaseButton: permissions.UPDATE_CASE_CONTEXT,
    showExternalButtons: isExternalUser,
    showFileDocumentButton,
    showFileFirstDocumentButton,
    showPendingAccessToCaseButton,
    showRequestAccessToCaseButton,
    showSealedCaseBanner: isCaseSealed,
    showUploadCourtIssuedDocumentButton: isInternalUser,
  };
};
