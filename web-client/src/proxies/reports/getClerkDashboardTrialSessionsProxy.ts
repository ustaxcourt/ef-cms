import { ClientApplicationContext } from '@web-client/applicationContext';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { get } from '../requests';

export const getClerkDashboardTrialSessionsInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<TrialSessionInfoDTO[]> => {
  return get({
    applicationContext,
    endpoint: '/reports/clerk-dashboard-stats/trial-sessions',
  });
};
