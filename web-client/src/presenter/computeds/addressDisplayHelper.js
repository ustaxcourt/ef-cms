import { state } from 'cerebral';

export const addressDisplayHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const user = applicationContext.getCurrentUser();
  const { STATUS_TYPES, USER_ROLES } = applicationContext.getConstants();

  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const permissions = get(state.permissions);

  const contactPrimary =
    applicationContext.getUtilities().getContactPrimary(caseDetail) ||
    form.contactPrimary;

  const contactSecondary =
    applicationContext.getUtilities().getContactSecondary(caseDetail) ||
    form?.contactSecondary;

  let showEditPrimaryContact;
  let showSealedPrimaryContact;
  let showEditSecondaryContact;
  let showSealedSecondaryContact;

  let showEditPetitionerInformation = false;

  if (user.role === USER_ROLES.petitioner) {
    showEditPrimaryContact =
      contactPrimary.contactId === user.userId &&
      !contactPrimary.isAddressSealed;
    showSealedPrimaryContact =
      contactPrimary.contactId === user.userId &&
      contactPrimary.isAddressSealed;

    showEditSecondaryContact =
      contactSecondary?.contactId === user.userId &&
      !contactSecondary?.isAddressSealed;
    showSealedSecondaryContact =
      contactSecondary?.contactId === user.userId &&
      contactSecondary?.isAddressSealed;
  } else if (user.role === USER_ROLES.privatePractitioner) {
    showEditPrimaryContact = userAssociatedWithCase;
    showEditSecondaryContact = userAssociatedWithCase;
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
    showEditPetitionerInformation,
  };
};
