import { state } from 'cerebral';

export const partiesInformationHelper = (get, applicationContext) => {
  const {
    CONTACT_TYPES,
    UNIQUE_OTHER_FILER_TYPE,
  } = applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);

  const formattedParties = caseDetail.petitioners.map(petitioner => {
    const representingPractitioners = applicationContext
      .getUtilities()
      .getPractitionersRepresenting(caseDetail, petitioner.contactId);

    if (petitioner.contactType === CONTACT_TYPES.otherFiler) {
      petitioner.formattedTitle =
        petitioner.otherFilerType === UNIQUE_OTHER_FILER_TYPE
          ? petitioner.otherFilerType
          : 'Participant';
    }

    return {
      ...petitioner,
      hasCounsel: representingPractitioners.length > 0,
      representingPractitioners,
    };
  });

  const formattedPetitioners = formattedParties.filter(
    petitioner => petitioner.contactType !== CONTACT_TYPES.otherFiler,
  );
  const formattedParticipants = formattedParties.filter(
    petitioner => petitioner.contactType === CONTACT_TYPES.otherFiler,
  );

  return {
    formattedParticipants,
    formattedPetitioners,
    showParticipantsTab: formattedParticipants.length,
  };
};
