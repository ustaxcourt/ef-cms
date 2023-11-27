import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const headerPublicHelper = (
  get: Get,
): { onCreationPage: boolean; onVerificationSentPage: boolean } => {
  const currentPage = get(state.currentPage) || '';

  const onCreationPage = currentPage.startsWith('CreatePetitionerAccount');
  const onVerificationSentPage = currentPage.startsWith('VerificationSent');

  return { onCreationPage, onVerificationSentPage };
};
