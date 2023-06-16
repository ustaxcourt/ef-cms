import { state } from '@web-client/presenter/app.cerebral';

export const practitionerSearchFormHelper = get => {
  const permissions = get(state.permissions);

  return { showAddPractitioner: permissions.ADD_EDIT_PRACTITIONER_USER };
};
