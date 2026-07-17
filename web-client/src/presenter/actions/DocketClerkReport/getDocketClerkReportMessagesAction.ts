import { state } from '@web-client/presenter/app.cerebral';

/**
 * fetches the selected docket clerk's Inbox, Sent (outbox), and Completed
 * messages for the docket clerk report
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const getDocketClerkReportMessagesAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps): Promise<void> => {
  const selectedClerk = get(state.docketClerkReport.selectedClerk);

  if (!selectedClerk) {
    return;
  }

  const useCases = applicationContext.getUseCases();

  const [inboxMessages, sentMessages, completedMessages] = await Promise.all([
    useCases.getInboxMessagesForUserInteractor(applicationContext, {
      userId: selectedClerk.userId,
    }),
    useCases.getOutboxMessagesForUserInteractor(applicationContext, {
      userId: selectedClerk.userId,
    }),
    useCases.getCompletedMessagesForUserInteractor(applicationContext, {
      filterByInbox: true,
      userId: selectedClerk.userId,
    }),
  ]);

  store.set(state.docketClerkReport.inboxMessages, inboxMessages);
  store.set(state.docketClerkReport.sentMessages, sentMessages);
  store.set(state.docketClerkReport.completedMessages, completedMessages);
};
