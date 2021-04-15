import { state } from 'cerebral';

export const caseInformationHelper = (get, applicationContext) => {
  const { STATUS_TYPES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const permissions = get(state.permissions);
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

  const otherPetitioners =
    applicationContext.getUtilities().getOtherPetitioners(caseDetail) || [];

  const showOtherPetitioners = !!otherPetitioners.length;
  const formattedOtherPetitioners = showingAdditionalPetitioners
    ? otherPetitioners
    : otherPetitioners.slice(0, 4);

  const showSealAddressLink = permissions.SEAL_ADDRESS;
  const showHearingsTable = !!caseDetail.hearings?.length;

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail);
  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(caseDetail);
  const showContactPrimaryEmail = contactPrimary?.email;
  const showContactSecondaryEmail = contactSecondary?.email;

  const showAddPetitionerButton =
    permissions.ADD_PETITIONER_TO_CASE &&
    caseDetail.status !== STATUS_TYPES.new;

  return {
    formattedOtherPetitioners,
    showAddCounsel,
    showAddPetitionerButton,
    showContactPrimaryEmail,
    showContactSecondaryEmail,
    showEditIrsPractitioners: showEditIrsPractitionersButton,
    showEditPrivatePractitioners: showEditPrivatePractitionersButton,
    showHearingsTable,
    showOtherPetitioners,
    showSealAddressLink,
    showSealCaseButton,
    toggleAdditionalPetitionersDisplay,
  };
};
