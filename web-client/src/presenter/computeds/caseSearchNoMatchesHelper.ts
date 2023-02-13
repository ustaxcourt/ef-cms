export const caseSearchNoMatchesHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  let showSearchByNameOption = true;

  if (user.role === USER_ROLES.petitioner) {
    showSearchByNameOption = false;
  }

  return { showSearchByNameOption };
};
