import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const headerPublicHelper = (get: Get): { inSignUpProcess: boolean } => {
  const currentPage = get(state.currentPage) || '';
  const inSignUpProcess =
    currentPage.startsWith('CreatePetitionerAccount') ||
    currentPage.startsWith('VerificationSent');

  return { inSignUpProcess };
};
