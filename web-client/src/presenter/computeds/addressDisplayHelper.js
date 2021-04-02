import { state } from 'cerebral';

export const addressDisplayHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const caseStatus = caseDetail.status;
  const user = applicationContext.getCurrentUser();
  const { STATUS_TYPES, USER_ROLES } = applicationContext.getConstants();
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail);

  let showEditPrimaryContact =
    contactPrimary.contactId === user.userId && !contactPrimary.isAddressSealed;

  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(caseDetail);

  let showEditSecondaryContact =
    contactSecondary?.contactId === user.userId &&
    !contactSecondary?.isAddressSealed;

  let showEditPetitionerInformation = false;
  const permissions = get(state.permissions);

  let showEditContacts = false;

  if (user.role === USER_ROLES.petitioner) {
    showEditContacts = true;
  } else if (user.role === USER_ROLES.privatePractitioner) {
    showEditContacts = userAssociatedWithCase;
    showEditPrimaryContact = userAssociatedWithCase;
  } else if (
    permissions.EDIT_PETITIONER_INFO &&
    caseStatus !== STATUS_TYPES.new
  ) {
    showEditPetitionerInformation = true;
  }

  return {
    showEditContacts,
    showEditPetitionerInformation,
    showEditPrimaryContact,
    showEditSecondaryContact,
  };
};
