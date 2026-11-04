import { ClerkOfCourtDashboardTab } from '@web-client/presenter/clerkOfCourtDashboardState';
import { state } from '@web-client/presenter/app.cerebral';

const getTabStats = (
  applicationContext: ActionProps['applicationContext'],
  tab: ClerkOfCourtDashboardTab,
) =>
  tab === 'cases'
    ? applicationContext
        .getUseCases()
        .getClerkDashboardCasesStatsInteractor(applicationContext)
    : applicationContext
        .getUseCases()
        .getClerkDashboardPetitionsStatsInteractor(applicationContext);

// each load of a tab gets a number, so a response from an older load cannot overwrite a newer one
const latestRequestIds: Record<ClerkOfCourtDashboardTab, number> = {
  cases: 0,
  petitions: 0,
};

/**
 * Loads one dashboard tab's stats from that tab's own endpoint, so each tab
 * renders as soon as its own data loads.
 */
export const setClerkOfCourtDashboardChartsAction =
  (tab: ClerkOfCourtDashboardTab) =>
  async ({ applicationContext, store }: ActionProps) => {
    const requestId = ++latestRequestIds[tab];
    store.set(state.clerkOfCourtDashboardStats[tab].status, 'loading');

    try {
      const stats = await getTabStats(applicationContext, tab);

      if (requestId !== latestRequestIds[tab]) return;
      store.set(state.clerkOfCourtDashboardStats[tab].data, stats);
      store.set(state.clerkOfCourtDashboardStats[tab].status, 'loaded');
    } catch (e) {
      if (requestId !== latestRequestIds[tab]) return;
      console.error(`setClerkOfCourtDashboardChartsAction(${tab}) failed:`, e);
      store.set(state.clerkOfCourtDashboardStats[tab].status, 'error');
    }
  };
