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
    USER_ROLES,
  } = applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);
  const screenMetadata = get(state.screenMetadata);
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);

  const formattedPrivatePractitioners = (
    caseDetail.privatePractitioners || []
  ).map(practitioner =>
    formatCounsel({ counsel: practitioner, screenMetadata }),
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

    petitioner.formattedPendingEmail =
      screenMetadata.pendingEmails &&
      screenMetadata.pendingEmails[petitioner.contactId]
        ? `${screenMetadata.pendingEmails[petitioner.contactId]} (Pending)`
        : undefined;

    if (petitioner.email) {
      petitioner.formattedEmail = petitioner.email;
    } else {
      petitioner.formattedEmail = petitioner.formattedPendingEmail
        ? undefined
        : 'No email provided';
    }

    const userAssociatedWithCase = !!formattedPrivatePractitioners.find(
      practitioner =>
        user.barNumber === practitioner.barNumber &&
        practitioner.representing.includes(petitioner.contactId),
    );

    const petitionIsServed = !!applicationContext
      .getUtilities()
      .getPetitionDocketEntry(caseDetail)?.servedAt;

    let canEditPetitioner = false;
    if (user.role === USER_ROLES.petitioner) {
      canEditPetitioner = petitioner.contactId === user.userId;
    } else if (user.role === USER_ROLES.privatePractitioner) {
      canEditPetitioner = userAssociatedWithCase;
    } else if (permissions.EDIT_PETITIONER_INFO) {
      canEditPetitioner = true;
    }
    canEditPetitioner = petitionIsServed && canEditPetitioner;

    return {
      ...petitioner,
      canEditPetitioner,
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

  const canEditRespondent = permissions.EDIT_COUNSEL_ON_CASE;

  const formattedRespondents = (caseDetail.irsPractitioners || []).map(
    respondent => ({
      ...formatCounsel({ counsel: respondent, screenMetadata }),
      canEditRespondent,
    }),
  );

  return {
    formattedParticipants,
    formattedPetitioners,
    formattedRespondents,
    showParticipantsTab: formattedParticipants.length > 0,
  };
};
