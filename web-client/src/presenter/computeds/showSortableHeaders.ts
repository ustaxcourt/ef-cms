import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const showSortableHeaders = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const { role } = get(state.user);

  const { USER_ROLES } = applicationContext.getConstants();

  return role === USER_ROLES.adc;
};
