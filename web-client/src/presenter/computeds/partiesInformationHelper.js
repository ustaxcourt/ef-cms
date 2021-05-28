import { capitalize } from 'lodash';
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

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail);
  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(caseDetail);

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

    // this can be updated when consolidating update primaryContact and update secondaryContact interacor
    let externalType = null;

    if (petitioner.contactId === contactPrimary?.contactId) {
      externalType = 'primary';
    } else if (petitioner.contactId === contactSecondary?.contactId) {
      externalType = 'secondary';
    }

    console.log('canEditPetitioner', canEditPetitioner);
    console.log('isExternalUser', isExternalUser);

    const editPetitionerLink = isExternalUser
      ? externalType
        ? `/case-detail/${caseDetail.docketNumber}/contacts/${externalType}/edit`
        : null
      : `/case-detail/${caseDetail.docketNumber}/edit-petitioner-information/${petitioner.contactId}`;

    console.log(
      'canEditPetitioner && !!editPetitionerLink',
      canEditPetitioner && !!editPetitionerLink,
    );
    return {
      ...petitioner,
      canEditPetitioner: canEditPetitioner && !!editPetitionerLink,
      editPetitionerLink,
      hasCounsel: representingPractitioners.length > 0,
      representingPractitioners,
      showExternalHeader: isExternalUser,
    };
  });

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
    showParticipantsTab: formattedParticipants.length > 0,
  };
};
