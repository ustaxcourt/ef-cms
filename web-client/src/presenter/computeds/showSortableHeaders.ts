import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const showSortableHeaders = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { role } = get(state.user);

  const { USER_ROLES } = applicationContext.getConstants();

  return role === USER_ROLES.adc || role === USER_ROLES.docketClerk;
};
