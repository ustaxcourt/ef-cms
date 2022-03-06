import { state } from 'cerebral';

export const caseDetailHeaderHelper = (get, applicationContext) => {
  const { STATUS_TYPES, USER_ROLES } = applicationContext.getConstants();

  const user = applicationContext.getCurrentUser();
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const caseDetail = get(state.caseDetail);
  const permissions = get(state.permissions);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const currentPage = get(state.currentPage);

  const isCaseSealed = !!caseDetail.isSealed;

  const caseHasRepresentedParty = caseDetail.petitioners.some(petitioner =>
    applicationContext
      .getUtilities()
      .isUserIdRepresentedByPrivatePractitioner(
        caseDetail,
        petitioner.contactId,
      ),
  );

  let showRequestAccessToCaseButton = false;
  let showPendingAccessToCaseButton = false;
  let showFileFirstDocumentButton = false;

  if (isExternalUser && !userAssociatedWithCase) {
    const pendingAssociation = get(state.screenMetadata.pendingAssociation);

    const isCurrentPageFilePetitionSuccess =
      currentPage === 'FilePetitionSuccess';
    const isRequestAccessForm = currentPage === 'RequestAccessWizard';

    if (user.role === USER_ROLES.privatePractitioner) {
      showRequestAccessToCaseButton =
        !pendingAssociation &&
        !isRequestAccessForm &&
        !isCaseSealed &&
        !isCurrentPageFilePetitionSuccess;

      showPendingAccessToCaseButton = pendingAssociation;
    } else if (user.role === USER_ROLES.irsPractitioner) {
      const caseHasRespondent = !!caseDetail.hasIrsPractitioner;

      showFileFirstDocumentButton = !caseHasRespondent && !isCaseSealed;

      showRequestAccessToCaseButton =
        caseHasRespondent &&
        !isRequestAccessForm &&
        !isCaseSealed &&
        !isCurrentPageFilePetitionSuccess;
    }
  }

  const canAllowDocumentServiceForCase = applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);

  const showBlockedTag =
    caseDetail.blocked ||
    (caseDetail.automaticBlocked &&
      caseDetail.status !== STATUS_TYPES.calendared);

  return {
    hidePublicCaseInformation: !isExternalUser,
    showAddCorrespondenceButton: permissions.CASE_CORRESPONDENCE,
    showAddDocketEntryButton: permissions.DOCKET_ENTRY,
    showBlockedTag,
    showCaseDetailHeaderMenu: !isExternalUser,
    showConsolidatedCaseIcon: !!caseDetail.leadDocketNumber,
    showCreateMessageButton: user.role !== USER_ROLES.general,
    showCreateOrderButton: permissions.COURT_ISSUED_DOCUMENT,
    showExternalButtons: isExternalUser && canAllowDocumentServiceForCase,
    showFileDocumentButton:
      permissions.FILE_EXTERNAL_DOCUMENT && userAssociatedWithCase,
    showFileFirstDocumentButton,
    showNewTabLink: isInternalUser,
    showPendingAccessToCaseButton,
    showRepresented: isInternalUser && caseHasRepresentedParty,
    showRequestAccessToCaseButton,
    showSealedCaseBanner: isCaseSealed,
    showUploadCourtIssuedDocumentButton: isInternalUser,
  };
};
