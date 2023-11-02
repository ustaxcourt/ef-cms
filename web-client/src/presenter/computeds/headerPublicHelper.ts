import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';

export const headerPublicHelper = (get: Get) => {
  const currentPage = get(state.currentPage) || '';
  const isOnSignUpPage = currentPage.startsWith('CreatePetitioner');

  return { isOnSignUpPage };
};
