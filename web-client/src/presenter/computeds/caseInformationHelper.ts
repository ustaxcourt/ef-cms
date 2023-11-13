import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const caseInformationHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { STATUS_TYPES } = applicationContext.getConstants();

  const user = applicationContext.getCurrentUser();
  const caseDetail = get(state.caseDetail);
  const permissions = get(state.permissions);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const canEditCounsel = permissions.EDIT_COUNSEL_ON_CASE;

  const showEditPrivatePractitionersButton =
    canEditCounsel && !!caseDetail.privatePractitioners?.length;

  const showViewCounselButton = !canEditCounsel;

  const showEditIrsPractitionersButton =
    canEditCounsel &&
    caseDetail.irsPractitioners &&
    !!caseDetail.irsPractitioners.length;

  const isSealedCase = applicationContext
    .getUtilities()
    .isSealedCase(caseDetail);

  const showAddCounsel = canEditCounsel;
  const showSealCaseButton = permissions.SEAL_CASE && !isSealedCase;
  const showUnsealCaseButton = permissions.UNSEAL_CASE && isSealedCase;
  const showingAdditionalPetitioners =
    get(state.showingAdditionalPetitioners) || false;
  const toggleAdditionalPetitionersDisplay = showingAdditionalPetitioners
    ? 'Hide'
    : 'View';

  const showSealAddressLink = permissions.SEAL_ADDRESS;
  const showHearingsTable = !!caseDetail.hearings?.length;

  const allPetitioners = caseDetail.petitioners;

  const formattedPetitioners = showingAdditionalPetitioners
    ? allPetitioners
    : allPetitioners.slice(0, 4);

  const showAddPartyButton =
    permissions.ADD_PETITIONER_TO_CASE &&
    caseDetail.status !== STATUS_TYPES.new;

  return {
    formattedPetitioners,
    isInternalUser,
    showAddCounsel,
    showAddPartyButton,
    showEditCaseButton: permissions.UPDATE_CASE_CONTEXT,
    showEditIrsPractitioners: showEditIrsPractitionersButton,
    showEditPrivatePractitioners: showEditPrivatePractitionersButton,
    showHearingsTable,
    showSealAddressLink,
    showSealCaseButton,
    showUnsealCaseButton,
    showViewCounselButton,
    toggleAdditionalPetitionersDisplay,
  };
};
