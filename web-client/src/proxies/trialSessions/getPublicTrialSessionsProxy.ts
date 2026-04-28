import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { get } from '@web-client/proxies/requests';

export const getPublicTrialSessionsInteractor = (
  applicationContext,
): Promise<TrialSessionInfoDTO[]> => {
  return get({
    applicationContext,
    endpoint: '/public-api/trial-sessions',
  });
};
