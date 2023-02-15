import { state } from 'cerebral';

export const showSortableHeaders = (get, applicationContext) => {
  const { role } = get(state.user);

  const { USER_ROLES } = applicationContext.getConstants();

  return role === USER_ROLES.adc;
};
