import { state } from 'cerebral';

export const practitionerSearchFormHelper = get => {
  const permissions = get(state.permissions);

  // TODO: we might need a different permission since all internal users have this permission
  // the story says only an admissions clerk has access to add practitioners
  return { showAddPractitioner: permissions.MANAGE_PRACTITIONER_USERS };
};
