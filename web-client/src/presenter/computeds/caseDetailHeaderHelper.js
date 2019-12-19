import { state } from 'cerebral';

export const caseDetailHeaderHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);

  const caseDetail = get(state.caseDetail);
  const permissions = get(state.permissions);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const pendingAssociation = get(state.screenMetadata.pendingAssociation);
  const caseHasRespondent =
    !!caseDetail && !!caseDetail.respondents && !!caseDetail.respondents.length;
  const currentPage = get(state.currentPage);
  const isRequestAccessForm = currentPage === 'RequestAccessWizard';

  let showRequestAccessToCaseButton = false;
  let showPendingAccessToCaseButton = false;
  let showFileFirstDocumentButton = false;

  if (isExternalUser && !userAssociatedWithCase) {
    if (user.role === USER_ROLES.practitioner) {
      showRequestAccessToCaseButton =
        !pendingAssociation && !isRequestAccessForm;
      showPendingAccessToCaseButton = pendingAssociation;
    } else if (user.role === USER_ROLES.respondent) {
      showFileFirstDocumentButton = !caseHasRespondent;
      showRequestAccessToCaseButton = caseHasRespondent && !isRequestAccessForm;
    }
  }

  const showConsolidatedCaseIcon = !!caseDetail.leadCaseId;

  const showCreateOrderButton =
    permissions.COURT_ISSUED_DOCUMENT &&
    ['CaseDetailInternal'].includes(currentPage);

  const showAddDocketEntryButton =
    permissions.DOCKET_ENTRY && ['CaseDetailInternal'].includes(currentPage);

  const showCaseDetailHeaderMenu =
    !isExternalUser &&
    ['CaseDetailInternal', 'DocumentDetail'].includes(currentPage);

  const showFileDocumentButton =
    permissions.FILE_EXTERNAL_DOCUMENT &&
    ['CaseDetail'].includes(currentPage) &&
    userAssociatedWithCase;

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
  };
};
