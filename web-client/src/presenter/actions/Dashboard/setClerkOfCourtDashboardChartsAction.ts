import { ClerkDashboardStats } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import { state } from '@web-client/presenter/app.cerebral';

// each load gets a number, so a response from an older load cannot overwrite a newer one
let latestRequestId = 0;

export const setClerkOfCourtDashboardChartsAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  const requestId = ++latestRequestId;
  store.set(state.clerkOfCourtDashboardStatsStatus, 'loading');

  try {
    const stats: ClerkDashboardStats = await applicationContext
      .getUseCases()
      .getClerkDashboardStatsInteractor(applicationContext, {});

    if (requestId !== latestRequestId) return;
    store.set(state.clerkOfCourtDashboardStats, stats);
    store.set(state.clerkOfCourtDashboardStatsStatus, 'loaded');
  } catch (e) {
    if (requestId !== latestRequestId) return;
    console.error('setClerkOfCourtDashboardChartsAction failed:', e);
    store.set(state.clerkOfCourtDashboardStatsStatus, 'error');
  }
};
