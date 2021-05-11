import { state } from 'cerebral';

const formatCounsel = ({ counsel, screenMetadata }) => {
  counsel.formattedEmail = counsel.email || 'No email provided';
  counsel.formattedPendingEmail =
    screenMetadata.pendingEmails && screenMetadata.pendingEmails[counsel.userId]
      ? `${screenMetadata.pendingEmails[counsel.userId]} (Pending)`
      : undefined;

  return counsel;
};

export const partiesInformationHelper = (get, applicationContext) => {
  const {
    CONTACT_TYPES,
    UNIQUE_OTHER_FILER_TYPE,
  } = applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);
  const screenMetadata = get(state.screenMetadata);
  const user = applicationContext.getCurrentUser();

  const formattedPrivatePractitioners = caseDetail.privatePractitioners.map(
    practitioner => formatCounsel({ counsel: practitioner, screenMetadata }),
  );

  const formattedParties = caseDetail.petitioners.map(petitioner => {
    const practitionersWithEmail = {
      privatePractitioners: formattedPrivatePractitioners,
    };

    const representingPractitioners = applicationContext
      .getUtilities()
      .getPractitionersRepresenting(
        practitionersWithEmail,
        petitioner.contactId,
      );

    if (petitioner.contactType === CONTACT_TYPES.otherFiler) {
      petitioner.formattedTitle =
        petitioner.otherFilerType === UNIQUE_OTHER_FILER_TYPE
          ? petitioner.otherFilerType
          : 'Participant';
    }

    petitioner.formattedEmail = petitioner.email || 'No email provided';
    petitioner.formattedPendingEmail =
      screenMetadata.pendingEmails &&
      screenMetadata.pendingEmails[petitioner.contactId]
        ? `${screenMetadata.pendingEmails[petitioner.contactId]} (Pending)`
        : undefined;

    const canEditPetitioner =
      applicationContext.getUtilities().isInternalUser(user.role) ||
      !!formattedPrivatePractitioners.find(
        practitioner =>
          user.barNumber === practitioner.barNumber &&
          practitioner.representing.includes(petitioner.contactId),
      ) ||
      petitioner.contactId === user.userId;

    const canEditRespondent = applicationContext
      .getUtilities()
      .isInternalUser(user.role);

    const canEditParticipant = applicationContext
      .getUtilities()
      .isInternalUser(user.role);

    return {
      ...petitioner,
      canEditParticipant,
      canEditPetitioner,
      canEditRespondent,
      hasCounsel: representingPractitioners.length > 0,
      representingPractitioners,
      showExternalHeader: applicationContext
        .getUtilities()
        .isExternalUser(user.role),
    };
  });

  const formattedPetitioners = formattedParties.filter(
    petitioner => petitioner.contactType !== CONTACT_TYPES.otherFiler,
  );
  const formattedParticipants = formattedParties.filter(
    petitioner => petitioner.contactType === CONTACT_TYPES.otherFiler,
  );

  const formattedRespondents = caseDetail.irsPractitioners.map(respondent =>
    formatCounsel({ counsel: respondent, screenMetadata }),
  );

  return {
    formattedParticipants,
    formattedPetitioners,
    formattedRespondents,
    showParticipantsTab: formattedParticipants.length > 0,
  };
};
