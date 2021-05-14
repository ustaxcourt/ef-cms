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
  const caseHasRespondent = !!caseDetail.hasIrsPractitioner;
  const currentPage = get(state.currentPage);
  const isRequestAccessForm = currentPage === 'RequestAccessWizard';

  const isCaseSealed = !!caseDetail.isSealed;

  const isCurrentPageFilePetitionSuccess =
    get(state.currentPage) === 'FilePetitionSuccess';

  let showRequestAccessToCaseButton = false;
  let showPendingAccessToCaseButton = false;
  let showFileFirstDocumentButton = false;

  if (isExternalUser && !userAssociatedWithCase) {
    if (user.role === USER_ROLES.privatePractitioner) {
      showRequestAccessToCaseButton =
        !pendingAssociation &&
        !isRequestAccessForm &&
        !isCaseSealed &&
        !isCurrentPageFilePetitionSuccess;
      showPendingAccessToCaseButton = pendingAssociation;
    } else if (user.role === USER_ROLES.irsPractitioner) {
      showFileFirstDocumentButton = !caseHasRespondent && !isCaseSealed;
      showRequestAccessToCaseButton =
        caseHasRespondent &&
        !isRequestAccessForm &&
        !isCaseSealed &&
        !isCurrentPageFilePetitionSuccess;
    }
  }

  const showConsolidatedCaseIcon = !!caseDetail.leadDocketNumber;

  const showCreateOrderButton = permissions.COURT_ISSUED_DOCUMENT;

  const showAddDocketEntryButton = permissions.DOCKET_ENTRY;

  const showNewTabLink = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const showCaseDetailHeaderMenu = !isExternalUser;

  const caseHasServedPetition = applicationContext
    .getUtilities()
    .caseHasServedPetition(caseDetail);

  const showFileDocumentButton =
    permissions.FILE_EXTERNAL_DOCUMENT &&
    userAssociatedWithCase &&
    caseHasServedPetition;

  const showAddCorrespondenceButton = permissions.CASE_CORRESPONDENCE;

  const caseHasServedDocketEntries = applicationContext
    .getUtilities()
    .caseHasServedDocketEntries(caseDetail);

  const showCreateMessageButton = user.role !== USER_ROLES.general;

  return {
    hidePublicCaseInformation: !isExternalUser,
    showAddCorrespondenceButton,
    showAddDocketEntryButton,
    showCaseDetailHeaderMenu,
    showConsolidatedCaseIcon,
    showCreateMessageButton,
    showCreateOrderButton,
    showEditCaseButton: permissions.UPDATE_CASE_CONTEXT,
    showExternalButtons: isExternalUser && caseHasServedDocketEntries,
    showFileDocumentButton,
    showFileFirstDocumentButton,
    showNewTabLink,
    showPendingAccessToCaseButton,
    showRequestAccessToCaseButton,
    showSealedCaseBanner: isCaseSealed,
    showUploadCourtIssuedDocumentButton: isInternalUser,
  };
};
