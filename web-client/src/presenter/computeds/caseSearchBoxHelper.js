export const caseSearchBoxHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  let showSearchDescription = true;
  let showAdvancedSearch = true;

  if (user.role === USER_ROLES.irsSuperuser) {
    showSearchDescription = false;
  }

  if (user.role === USER_ROLES.petitioner) {
    showAdvancedSearch = false;
  }

  return { showAdvancedSearch, showSearchDescription };
};
