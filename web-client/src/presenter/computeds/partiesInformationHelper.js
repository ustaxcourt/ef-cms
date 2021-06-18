import { capitalize } from 'lodash';
import { state } from 'cerebral';

const formatCounsel = ({ counsel, screenMetadata }) => {
  const counselPendingEmail = screenMetadata.pendingEmails
    ? screenMetadata.pendingEmails[counsel.userId]
    : undefined;

  if (counselPendingEmail) {
    counsel.formattedPendingEmail = `${counselPendingEmail} (Pending)`;
  }

  if (counsel.email && counselPendingEmail !== counsel.email) {
    counsel.formattedEmail = counsel.email;
  } else {
    counsel.formattedEmail = counsel.formattedPendingEmail
      ? undefined
      : 'No email provided';
  }

  return counsel;
};

export const partiesInformationHelper = (get, applicationContext) => {
  const { CONTACT_TYPES, USER_ROLES } = applicationContext.getConstants();
  const otherContactTypes = [
    CONTACT_TYPES.intervenor,
    CONTACT_TYPES.participant,
  ];

  const caseDetail = get(state.caseDetail);
  const screenMetadata = get(state.screenMetadata);
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);

  const formattedPrivatePractitioners = (
    caseDetail.privatePractitioners || []
  ).map(practitioner =>
    formatCounsel({ counsel: practitioner, screenMetadata }),
  );

  const formattedParties = (caseDetail.petitioners || []).map(petitioner => {
    const practitionersWithEmail = {
      privatePractitioners: formattedPrivatePractitioners,
    };

    const representingPractitioners = applicationContext
      .getUtilities()
      .getPractitionersRepresenting(
        practitionersWithEmail,
        petitioner.contactId,
      );

    petitioner.formattedTitle = otherContactTypes.includes(
      petitioner.contactType,
    )
      ? capitalize(petitioner.contactType)
      : 'Petitioner';

    if (
      screenMetadata.pendingEmails &&
      screenMetadata.pendingEmails[petitioner.contactId]
    ) {
      petitioner.formattedPendingEmail = isExternalUser
        ? 'Email Pending'
        : `${screenMetadata.pendingEmails[petitioner.contactId]} (Pending)`;
    }

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

    const editPetitionerLink = isExternalUser
      ? `/case-detail/${caseDetail.docketNumber}/contacts/${petitioner.contactId}/edit`
      : `/case-detail/${caseDetail.docketNumber}/edit-petitioner-information/${petitioner.contactId}`;

    return {
      ...petitioner,
      canEditPetitioner: canEditPetitioner && !!editPetitionerLink,
      editPetitionerLink,
      hasCounsel: representingPractitioners.length > 0,
      representingPractitioners,
      showExternalHeader: isExternalUser,
    };
  });

  const showIntervenorRole = !formattedParties.some(
    party => party.contactType === CONTACT_TYPES.intervenor,
  );

  const formattedPetitioners = formattedParties.filter(
    petitioner => !otherContactTypes.includes(petitioner.contactType),
  );
  const formattedParticipants = formattedParties.filter(petitioner =>
    otherContactTypes.includes(petitioner.contactType),
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
    showIntervenorRole,
    showParticipantsTab: formattedParticipants.length > 0,
  };
};
