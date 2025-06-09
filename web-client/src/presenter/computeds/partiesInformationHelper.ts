import { capitalize } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';

export const formatCounsel = ({ counsel, screenMetadata }) => {
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

export const getCanEditPetitioner = ({
  permissions,
  petitioner,
  petitionIsServed,
  user,
  userAssociatedWithCase,
}) => {
  if (!petitionIsServed) return false;

  if (user.role === ROLES.petitioner) {
    return petitioner.contactId === user.userId;
  }

  if (user.role === ROLES.privatePractitioner) {
    return !!userAssociatedWithCase;
  }

  if (permissions.EDIT_PETITIONER_INFO) {
    return true;
  }

  return false;
};

export const partiesInformationHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { ALLOWLIST_FEATURE_FLAGS, CONTACT_TYPES } =
    applicationContext.getConstants();
  const otherContactTypes = [
    CONTACT_TYPES.intervenor,
    CONTACT_TYPES.participant,
  ];

  const caseDetail = get(state.caseDetail);
  const screenMetadata = get(state.screenMetadata);
  const user = get(state.user);
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

    petitioner.formattedPaperPetitionEmail =
      petitioner.paperPetitionEmail ?? 'Not provided';

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
        practitioner.representing?.includes(petitioner.contactId),
    );

    const canAllowDocumentServiceForCase = !!applicationContext
      .getUtilities()
      .canAllowDocumentServiceForCase(caseDetail);

    const canEditPetitioner = getCanEditPetitioner({
      permissions,
      petitionIsServed: canAllowDocumentServiceForCase,
      petitioner,
      user,
      userAssociatedWithCase,
    });

    const editPetitionerLink = isExternalUser
      ? `/case-detail/${caseDetail.docketNumber}/contacts/${petitioner.contactId}/edit`
      : `/case-detail/${caseDetail.docketNumber}/edit-petitioner-information/${petitioner.contactId}`;

    const E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG = get(
      state.featureFlags[
        ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key
      ],
    );

    const showPaperPetitionEmail =
      E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG &&
      !petitioner.sealedAndUnavailable &&
      !isExternalUser;

    const showRemoveEmailButton =
      permissions.REMOVE_PETITIONER_EMAIL &&
      !!petitioner.email &&
      petitioner.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;

    return {
      ...petitioner,
      canEditPetitioner,
      editPetitionerLink,
      hasCounsel: representingPractitioners.length > 0,
      representingPractitioners,
      showExternalHeader: isExternalUser,
      showPaperPetitionEmail,
      showRemoveEmailButton,
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
