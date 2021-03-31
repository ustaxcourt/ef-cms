import { state } from 'cerebral';

export const addressDisplayHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { STATUS_TYPES, USER_ROLES } = applicationContext.getConstants();
  const caseStatus = get(state.caseDetail.status);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  let showEditPetitionerInformation = false;
  const permissions = get(state.permissions);

  let showEditContacts = false;

  if (user.role === USER_ROLES.petitioner) {
    showEditContacts = true;
  } else if (user.role === USER_ROLES.privatePractitioner) {
    showEditContacts = userAssociatedWithCase;
  } else if (
    permissions.EDIT_PETITIONER_INFO &&
    caseStatus !== STATUS_TYPES.new
  ) {
    showEditPetitionerInformation = true;
  }

  return {
    showEditContacts,
    showEditPetitionerInformation,
  };
};
