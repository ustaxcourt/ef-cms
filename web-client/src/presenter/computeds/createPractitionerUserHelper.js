export const createPractitionerUserHelper = (get, applicationContext) => {
  const { USER_ROLES } = applicationContext.getConstants();

  const roles = [
    USER_ROLES.privatePractitioner,
    USER_ROLES.irsPractitioner,
    USER_ROLES.inactivePractitioner,
    USER_ROLES.inactivePractitioner,
  ];

  return {
    roles,
  };
};
