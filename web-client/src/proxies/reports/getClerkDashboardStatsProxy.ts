import { ClerkDashboardStats } from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '../requests';

export type GetClerkDashboardStatsParams = {
  year?: number;
};

export const getClerkDashboardStatsInteractor = (
  applicationContext: ClientApplicationContext,
  params: GetClerkDashboardStatsParams = {},
): Promise<ClerkDashboardStats> => {
  return get({
    applicationContext,
    endpoint: '/reports/clerk-dashboard-stats',
    params: params.year !== undefined ? { year: params.year } : {},
  });
};
