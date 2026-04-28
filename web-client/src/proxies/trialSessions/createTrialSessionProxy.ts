import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const createTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSession },
) => {
  return post({
    applicationContext,
    body: trialSession,
    endpoint: '/trial-sessions',
  });
};
