import { getDocumentQCInboxForUserInteractor } from '@web-client/proxies/workitems/getDocumentQCInboxForUserProxy';
import { getDocumentQCServedForUserInteractor } from '@web-client/proxies/workitems/getDocumentQCServedForUserProxy';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * fetches the selected docket clerk's Document QC inbox (which powers the Inbox
 * and In Progress boxes) and served (Processed) work items
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const getDocketClerkReportDocumentQcAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps): Promise<void> => {
  const selectedClerk = get(state.docketClerkReport.selectedClerk);

  if (!selectedClerk) {
    return;
  }

  const [inboxWorkItems, servedWorkItems] = await Promise.all([
    getDocumentQCInboxForUserInteractor(applicationContext, {
      userId: selectedClerk.userId,
    }),
    getDocumentQCServedForUserInteractor(applicationContext, {
      userId: selectedClerk.userId,
    }),
  ]);

  store.set(state.docketClerkReport.inboxWorkItems, inboxWorkItems);
  store.set(state.docketClerkReport.servedWorkItems, servedWorkItems);
};
