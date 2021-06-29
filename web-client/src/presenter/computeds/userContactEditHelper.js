import { state } from 'cerebral';

export const userContactEditHelper = (get, applicationContext) => {
  const user = get(state.user);
  const { USER_ROLES } = applicationContext.getConstants();

  return {
    showFirmName: USER_ROLES.privatePractitioner === user.role,
  };
};
