import { state } from '@web-client/presenter/app.cerebral';

// each load gets a number, so a response from an older load cannot overwrite a newer one
let latestRequestId = 0;

/**
 * Loads the user's inbox messages for the Recent Messages tab, after the
 * dashboard renders, so the page does not wait for them.
 */
export const setClerkOfCourtDashboardMessagesAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps): Promise<void> => {
  const requestId = ++latestRequestId;
  store.set(state.clerkOfCourtDashboardMessagesStatus, 'loading');

  try {
    const messages = await applicationContext
      .getUseCases()
      .getInboxMessagesForUserInteractor(applicationContext, {
        userId: get(state.user).userId,
      });

    if (requestId !== latestRequestId) return;
    store.set(state.clerkOfCourtDashboardMessagesStatus, 'loaded');
    // state.messages is shared with the Messages pages, so do not overwrite it after the user leaves
    if (get(state.currentPage) !== 'DashboardClerkOfCourt') return;
    store.set(state.messages, messages);
  } catch (e) {
    if (requestId !== latestRequestId) return;
    console.error('setClerkOfCourtDashboardMessagesAction failed:', e);
    store.set(state.clerkOfCourtDashboardMessagesStatus, 'error');
  }
};
