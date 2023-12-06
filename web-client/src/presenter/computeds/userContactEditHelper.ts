import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const userContactEditHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const user = get(state.user);
  const { USER_ROLES } = applicationContext.getConstants();

  return {
    showFirmName: USER_ROLES.privatePractitioner === user.role,
  };
};
