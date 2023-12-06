import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const practitionerSearchFormHelper = (get: Get): any => {
  const permissions = get(state.permissions);

  return { showAddPractitioner: permissions.ADD_EDIT_PRACTITIONER_USER };
};
