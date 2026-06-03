import { ClerkDashboardStats } from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
import { state } from '@web-client/presenter/app.cerebral';

export const setClerkOfCourtDashboardChartsAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  let stats: ClerkDashboardStats;
  try {
    stats = await applicationContext
      .getUseCases()
      .getClerkDashboardStatsInteractor(applicationContext, {});

    store.set(state.clerkOfCourtDashboardStats, stats);
  } catch (e) {
    console.error('setClerkOfCourtDashboardChartsAction failed:', e);
    return;
  }
};
