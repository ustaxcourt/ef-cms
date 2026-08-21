import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the docket clerk report state to its initial values
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const resetDocketClerkReportAction = ({ store }: ActionProps): void => {
  store.set(state.docketClerkReport.form, {});
  store.set(state.docketClerkReport.selectedClerk, null);
  store.set(state.docketClerkReport.pageType, null);
  store.set(state.docketClerkReport.box, 'inbox');
  store.set(state.docketClerkReport.inboxWorkItems, []);
  store.set(state.docketClerkReport.servedWorkItems, []);
  store.set(state.docketClerkReport.inboxMessages, []);
  store.set(state.docketClerkReport.sentMessages, []);
  store.set(state.docketClerkReport.completedMessages, []);
  store.set(state.validationErrors, {});
};
