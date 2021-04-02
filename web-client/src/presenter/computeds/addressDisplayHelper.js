import { state } from 'cerebral';

export const addressDisplayHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const user = applicationContext.getCurrentUser();
  const { STATUS_TYPES, USER_ROLES } = applicationContext.getConstants();
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const permissions = get(state.permissions);

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail);

  let showEditPrimaryContact =
    contactPrimary.contactId === user.userId && !contactPrimary.isAddressSealed;
  const showSealedPrimaryContact =
    contactPrimary.contactId === user.userId && contactPrimary.isAddressSealed;

  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(caseDetail);

  let showEditSecondaryContact =
    contactSecondary?.contactId === user.userId &&
    !contactSecondary?.isAddressSealed;
  const showSealedSecondaryContact =
    contactSecondary?.contactId === user.userId &&
    contactSecondary?.isAddressSealed;

  let showEditPetitionerInformation = false;
  let showEditContacts = false;

  if (user.role === USER_ROLES.petitioner) {
    showEditContacts = true;
  } else if (user.role === USER_ROLES.privatePractitioner) {
    showEditContacts = userAssociatedWithCase;
    showEditPrimaryContact = userAssociatedWithCase;
  } else if (
    permissions.EDIT_PETITIONER_INFO &&
    caseDetail.status !== STATUS_TYPES.new
  ) {
    showEditPetitionerInformation = true;
  }

  return {
    primary: {
      showEditContact: showEditPrimaryContact,
      showSealedContact: showSealedPrimaryContact,
    },
    secondary: {
      showEditContact: showEditSecondaryContact,
      showSealedContact: showSealedSecondaryContact,
    },
    showEditContacts,
    showEditPetitionerInformation,
  };
};
