import { state } from 'cerebral';

export const practitionerSearchFormHelper = get => {
  const permissions = get(state.permissions);

  return { showAddPractitioner: permissions.ADD_EDIT_PRACTITIONER_USER };
};
