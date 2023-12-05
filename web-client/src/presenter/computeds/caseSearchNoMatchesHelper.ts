import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const caseSearchNoMatchesHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  let showSearchByNameOption = true;

  if (user.role === USER_ROLES.petitioner) {
    showSearchByNameOption = false;
  }

  return { showSearchByNameOption };
};
