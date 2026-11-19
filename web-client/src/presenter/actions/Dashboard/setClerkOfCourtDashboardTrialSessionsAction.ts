import { state } from '@web-client/presenter/app.cerebral';

// each load gets a number, so a response from an older load cannot overwrite a newer one
let latestRequestId = 0;

/**
 * Loads the trial sessions for the current week and the next week, after the
 * dashboard renders, so the page does not wait for them.
 */
export const setClerkOfCourtDashboardTrialSessionsAction = async ({
  applicationContext,
  store,
}: ActionProps): Promise<void> => {
  const requestId = ++latestRequestId;
  store.set(state.clerkOfCourtDashboardTrialSessions.status, 'loading');

  try {
    const trialSessions = await applicationContext
      .getUseCases()
      .getClerkDashboardTrialSessionsInteractor(applicationContext);

    if (requestId !== latestRequestId) return;
    store.set(state.clerkOfCourtDashboardTrialSessions.data, trialSessions);
    store.set(state.clerkOfCourtDashboardTrialSessions.status, 'loaded');
  } catch (e) {
    if (requestId !== latestRequestId) return;
    console.error('setClerkOfCourtDashboardTrialSessionsAction failed:', e);
    store.set(state.clerkOfCourtDashboardTrialSessions.status, 'error');
  }
};
