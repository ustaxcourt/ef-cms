import { state } from 'cerebral';

export const caseInformationHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const caseDetail = get(state.caseDetail);
  const permissions = get(state.permissions);

  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const showEditPrivatePractitionersButton =
    permissions.ASSOCIATE_USER_WITH_CASE &&
    caseDetail.privatePractitioners &&
    !!caseDetail.privatePractitioners.length;
  const showEditIrsPractitionersButton =
    permissions.ASSOCIATE_USER_WITH_CASE &&
    caseDetail.irsPractitioners &&
    !!caseDetail.irsPractitioners.length;
  const showAddCounsel = permissions.ASSOCIATE_USER_WITH_CASE;
  const showSealCaseButton = permissions.SEAL_CASE && !caseDetail.isSealed;
  const showingAdditionalPetitioners =
    get(state.showingAdditionalPetitioners) || false;
  const toggleAdditionalPetitionersDisplay = showingAdditionalPetitioners
    ? 'Hide'
    : 'View';
  const otherPetitioners = [...(caseDetail.otherPetitioners || [])];
  const showOtherPetitioners = !!otherPetitioners.length;
  const formattedOtherPetitioners = showingAdditionalPetitioners
    ? otherPetitioners
    : otherPetitioners.slice(0, 4);

  const showSealAddressLink = permissions.SEAL_ADDRESS;
  const showHearingsTable = !!caseDetail.hearings?.length;

  return {
    formattedOtherPetitioners,
    showAddCounsel,
    showEditIrsPractitioners: showEditIrsPractitionersButton,
    showEditPrivatePractitioners: showEditPrivatePractitionersButton,
    showEmail: isInternalUser,
    showHearingsTable,
    showOtherPetitioners,
    showSealAddressLink,
    showSealCaseButton,
    toggleAdditionalPetitionersDisplay,
  };
};
