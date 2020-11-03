import { state } from 'cerebral';

/**
 * fetches the pending items
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} contains the pending items
 */
export const fetchPendingItemsAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  if (props.judge) {
    store.set(state.pendingReports, {
      hasPendingItemsResults: false,
      pendingItems: [],
      pendingItemsPage: 0,
    });
    store.set(state.pendingReports.selectedJudge, props.judge);
  }

  const judge = get(state.pendingReports.selectedJudge);

  if (!judge) return;

  const page = get(state.pendingReports.pendingItemsPage);

  const {
    foundDocuments,
    total,
  } = await applicationContext.getUseCases().fetchPendingItemsInteractor({
    applicationContext,
    judge,
    page,
  });

  return { pendingItems: foundDocuments, total };
};
