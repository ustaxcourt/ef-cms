import { ClerkDashboardStats } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setClerkOfCourtDashboardChartsAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  try {
    const stats: ClerkDashboardStats = await applicationContext
      .getUseCases()
      .getClerkDashboardStatsInteractor(applicationContext, {});

    store.set(state.clerkOfCourtDashboardStats, stats);
  } catch (e) {
    console.error('setClerkOfCourtDashboardChartsAction failed:', e);
    store.set(state.alertError, { message: 'Error getting dashboard data' });
    return;
  }
};
