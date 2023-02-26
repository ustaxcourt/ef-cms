import { state } from 'cerebral';

/**
 * fetches the pending items
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} contains the pending items
 */
export const fetchPendingItemsAction = async ({ applicationContext, get }) => {
  const judge = get(state.pendingReports.selectedJudge);

  const page = get(state.pendingReports.pendingItemsPage);

  const { foundDocuments, total } = await applicationContext
    .getUseCases()
    .fetchPendingItemsInteractor(applicationContext, {
      judge,
      page,
    });

  return { pendingItems: foundDocuments, total };
};
