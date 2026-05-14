import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { get } from '@web-client/proxies/requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPublicTrialSessionsInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<TrialSessionInfoDTO[]> => {
  return get({
    applicationContext,
    endpoint: '/public-api/trial-sessions',
  });
};
