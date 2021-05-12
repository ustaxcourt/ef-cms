import { state } from 'cerebral';

export const caseInformationHelper = (get, applicationContext) => {
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

  const showAddCounsel = permissions.ASSOCIATE_USER_WITH_CASE;
  const showSealCaseButton = permissions.SEAL_CASE && !caseDetail.isSealed;
  const showingAdditionalPetitioners =
    get(state.showingAdditionalPetitioners) || false;
  const toggleAdditionalPetitionersDisplay = showingAdditionalPetitioners
    ? 'Hide'
    : 'View';

  const showSealAddressLink = permissions.SEAL_ADDRESS;
  const showHearingsTable = !!caseDetail.hearings?.length;

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail);
  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(caseDetail);
  const contactPrimaryEmailFormatted = contactPrimary?.email ?? 'Not provided';
  const contactSecondaryEmailFormatted =
    contactSecondary?.email ?? 'Not provided';

  const allPetitioners = caseDetail.petitioners;

  const formattedPetitioners = showingAdditionalPetitioners
    ? allPetitioners
    : allPetitioners.slice(0, 4);

  const showAddPartyButton =
    permissions.ADD_PETITIONER_TO_CASE &&
    caseDetail.status !== STATUS_TYPES.new;

  return {
    contactPrimaryEmailFormatted,
    contactSecondaryEmailFormatted,
    formattedPetitioners,
    isInternalUser,
    showAddCounsel,
    showAddPartyButton,
    showEditIrsPractitioners: showEditIrsPractitionersButton,
    showEditPrivatePractitioners: showEditPrivatePractitionersButton,
    showHearingsTable,
    showSealAddressLink,
    showSealCaseButton,
    showViewCounselButton,
    toggleAdditionalPetitionersDisplay,
  };
};
