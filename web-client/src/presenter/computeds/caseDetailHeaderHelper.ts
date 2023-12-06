import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const caseDetailHeaderHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { USER_ROLES } = applicationContext.getConstants();

  const user = applicationContext.getCurrentUser();
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const caseDetail = get(state.caseDetail);
  const permissions = get(state.permissions);
  const userDirectlyAssociatedWithCase = get(
    state.screenMetadata.isDirectlyAssociated,
  );
  const currentPage = get(state.currentPage);

  const isCaseSealed = applicationContext
    .getUtilities()
    .isSealedCase(caseDetail);

  const caseHasRepresentedParty = caseDetail.petitioners.some(petitioner =>
    Case.isPetitionerRepresented(caseDetail, petitioner.contactId),
  );

  let showRequestAccessToCaseButton = false;
  let showPendingAccessToCaseButton = false;
  let showFileFirstDocumentButton = false;

  if (isExternalUser && !userDirectlyAssociatedWithCase) {
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
      const caseHasRespondent = !!(
        !!caseDetail.hasIrsPractitioner || caseDetail.irsPractitioners?.length
      );

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
    (caseDetail.automaticBlocked && !caseDetail.trialDate);

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
      permissions.FILE_EXTERNAL_DOCUMENT && userDirectlyAssociatedWithCase,
    showFileFirstDocumentButton,
    showNewTabLink: isInternalUser,
    showPendingAccessToCaseButton,
    showRepresented: isInternalUser && caseHasRepresentedParty,
    showRequestAccessToCaseButton,
    showSealedCaseBanner: isCaseSealed,
    showUploadCourtIssuedDocumentButton: isInternalUser,
  };
};
