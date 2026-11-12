import { ClientApplicationContext } from '@web-client/applicationContext';
import type { ClerkDashboardTrialSessions } from '@web-api/business/useCases/reports/getClerkDashboardTrialSessionsInteractor';
import { get } from '../requests';

export const getClerkDashboardTrialSessionsInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<ClerkDashboardTrialSessions> => {
  return get({
    applicationContext,
    endpoint: '/reports/clerk-dashboard-stats/trial-sessions',
  });
};
