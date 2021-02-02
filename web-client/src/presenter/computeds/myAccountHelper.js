export const myAccountHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  const showMyContactInformation =
    user.role === USER_ROLES.privatePractitioner ||
    user.role === USER_ROLES.irsPractitioner;

  return {
    showMyContactInformation,
  };
};
