import { ClerkDashboardStats } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setClerkOfCourtDashboardChartsAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  store.set(state.clerkOfCourtDashboardStatsStatus, 'loading');

  try {
    const stats: ClerkDashboardStats = await applicationContext
      .getUseCases()
      .getClerkDashboardStatsInteractor(applicationContext, {});

    store.set(state.clerkOfCourtDashboardStats, stats);
    store.set(state.clerkOfCourtDashboardStatsStatus, 'loaded');
  } catch (e) {
    console.error('setClerkOfCourtDashboardChartsAction failed:', e);
    store.set(state.clerkOfCourtDashboardStatsStatus, 'error');
  }
};
