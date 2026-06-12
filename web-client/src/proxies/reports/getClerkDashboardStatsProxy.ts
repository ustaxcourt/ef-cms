import type { ClerkDashboardStats } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import { get } from '../requests';

export const getClerkDashboardStatsInteractor = (
  applicationContext,
  params: { year?: number },
): Promise<ClerkDashboardStats> => {
  return get({
    applicationContext,
    endpoint: '/reports/clerk-dashboard-stats',
    params,
  });
};
