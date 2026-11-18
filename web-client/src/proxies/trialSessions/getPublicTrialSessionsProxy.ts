import { PublicTrialSessionInfo } from '@shared/business/dto/trialSessions/PublicTrialSessionInfo';
import { get } from '@web-client/proxies/requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPublicTrialSessionsInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<PublicTrialSessionInfo[]> => {
  return get({
    applicationContext,
    endpoint: '/public-api/trial-sessions',
  });
};
