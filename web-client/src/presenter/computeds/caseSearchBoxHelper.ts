import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const caseSearchBoxHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  let showSearchDescription = true;
  let showAdvancedSearch = true;

  if (
    user.role === USER_ROLES.irsSuperuser ||
    user.role === USER_ROLES.petitioner
  ) {
    showSearchDescription = false;
  }

  if (user.role === USER_ROLES.petitioner) {
    showAdvancedSearch = false;
  }

  return { showAdvancedSearch, showSearchDescription };
};
