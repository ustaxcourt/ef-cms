import { state } from 'cerebral';

export const partiesInformationHelper = (get, applicationContext) => {
  const { CONTACT_TYPES } = applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);

  const formattedPetitioners = caseDetail.petitioners.map(petitioner => {
    const representingPractitioners = applicationContext
      .getUtilities()
      .getPractitionersRepresenting(caseDetail, petitioner.contactId);

    return {
      ...petitioner,
      hasCounsel: representingPractitioners.length > 0,
      representingPractitioners,
    };
  });

  const showParticipantsTab = caseDetail.petitioners.some(
    petitioner => petitioner.contactType === CONTACT_TYPES.otherFiler,
  );

  return { formattedPetitioners, showParticipantsTab };
};
