import { state } from 'cerebral';

export const partiesInformationHelper = (get, applicationContext) => {
  const {
    CONTACT_TYPES,
    UNIQUE_OTHER_FILER_TYPE,
  } = applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);
  const screenMetadata = get(state.screenMetadata);

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

    petitioner.formattedEmail = petitioner.email || 'No email provided';
    petitioner.formattedPendingEmail = screenMetadata.pendingEmails[
      petitioner.contactId
    ]
      ? `${screenMetadata.pendingEmails[petitioner.contactId]} (Pending)`
      : undefined;

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

  const formattedRespondents = caseDetail.irsPractitioners.map(respondent => {
    respondent.formattedEmail = respondent.email || 'No email provided';
    respondent.formattedPendingEmail = screenMetadata.pendingEmails[
      respondent.userId
    ]
      ? `${screenMetadata.pendingEmails[respondent.userId]} (Pending)`
      : undefined;

    return respondent;
  });

  return {
    formattedParticipants,
    formattedPetitioners,
    formattedRespondents,
    showParticipantsTab: formattedParticipants.length > 0,
  };
};
