export const caseSearchBoxHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  let showSearchDescription = true;

  if (user.role === USER_ROLES.irsSuperuser) {
    showSearchDescription = false;
  }

  return { showSearchDescription };
};
