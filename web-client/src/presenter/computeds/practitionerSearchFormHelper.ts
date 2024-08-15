import { ClientApplicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';

import { Get } from '../../utilities/cerebralWrapper';
export const practitionerSearchFormHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const permissions = get(state.permissions);
  const isPublicUser = applicationContext.isPublicUser();

  return {
    showAddPractitioner:
      !isPublicUser && permissions.ADD_EDIT_PRACTITIONER_USER,
  };
};
