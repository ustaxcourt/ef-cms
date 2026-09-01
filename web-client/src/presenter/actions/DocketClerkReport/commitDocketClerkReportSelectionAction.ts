import { RawUser } from '@shared/business/entities/User';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * commits the selected docket clerk and page type from the form so the report
 * results reflect the run that was requested, and resets prior result data
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const commitDocketClerkReportSelectionAction = ({
  get,
  store,
}: ActionProps): void => {
  const form = get(state.docketClerkReport.form);
  const docketClerks: RawUser[] = get(state.docketClerkReport.docketClerks);

  const selectedClerk = docketClerks.find(
    clerk => clerk.userId === form.docketClerkUserId,
  );

  store.set(state.docketClerkReport.selectedClerk, selectedClerk || null);
  store.set(state.docketClerkReport.pageType, form.pageType);
  store.set(state.docketClerkReport.box, 'inbox');

  store.set(state.docketClerkReport.inboxWorkItems, []);
  store.set(state.docketClerkReport.servedWorkItems, []);
  store.set(state.docketClerkReport.inboxMessages, []);
  store.set(state.docketClerkReport.sentMessages, []);
  store.set(state.docketClerkReport.completedMessages, []);

  store.set(state.tableSort, {
    sortField: 'createdAt',
    sortOrder: 'desc',
  });
};
