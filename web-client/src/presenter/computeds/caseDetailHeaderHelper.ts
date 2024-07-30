import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import {
  PRACTICE_TYPE,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser } from '@shared/business/entities/User';
import { state } from '@web-client/presenter/app.cerebral';

const isUserADojPractitioner = (
  user: RawUser | RawPractitioner | RawIrsPractitioner,
): boolean => {
  if (user.role !== ROLES.irsPractitioner) return false;
  const irsPractitioner: RawPractitioner = user as RawPractitioner;
  if (irsPractitioner.practiceType !== PRACTICE_TYPE.DOJ) return false;
  return true;
};

const shouldShowRepresentAPartyButton = (
  caseDetail: RawCase,
  isDojPractitioner: boolean,
  caseHasRespondent: boolean,
  isRepresentAPartyForm: boolean,
  isCaseSealed: boolean,
  isCurrentPageFilePetitionSuccess: boolean,
): boolean => {
  return (
    caseHasRespondent &&
    !isRepresentAPartyForm &&
    !isCaseSealed &&
    !isCurrentPageFilePetitionSuccess &&
    !!(!isDojPractitioner || caseDetail.canDojPractitionersRepresentParty)
  );
};

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

  let showRepresentAPartyButton = false;
  let showPendingAccessToCaseButton = false;
  let showFileFirstDocumentButton = false;
  const isDojPractitioner = isUserADojPractitioner(user);

  if (isExternalUser && !userDirectlyAssociatedWithCase) {
    const pendingAssociation = get(state.screenMetadata.pendingAssociation);

    const isCurrentPageFilePetitionSuccess =
      currentPage === 'FilePetitionSuccess';
    const isRepresentAPartyForm = currentPage === 'RepresentAPartyWizard';

    if (user.role === USER_ROLES.privatePractitioner) {
      showRepresentAPartyButton =
        !pendingAssociation &&
        !isRepresentAPartyForm &&
        !isCaseSealed &&
        !isCurrentPageFilePetitionSuccess;

      showPendingAccessToCaseButton = pendingAssociation;
    } else if (user.role === USER_ROLES.irsPractitioner) {
      const caseHasRespondent = !!(
        !!caseDetail.hasIrsPractitioner || caseDetail.irsPractitioners?.length
      );

      showFileFirstDocumentButton =
        !caseHasRespondent && !isCaseSealed && !isDojPractitioner;

      showRepresentAPartyButton = shouldShowRepresentAPartyButton(
        caseDetail,
        isDojPractitioner,
        caseHasRespondent,
        isRepresentAPartyForm,
        isCaseSealed,
        isCurrentPageFilePetitionSuccess,
      );
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
    showRepresentAPartyButton,
    showRepresented: isInternalUser && caseHasRepresentedParty,
    showSealedCaseBanner: isCaseSealed,
    showUploadCourtIssuedDocumentButton: isInternalUser,
  };
};
