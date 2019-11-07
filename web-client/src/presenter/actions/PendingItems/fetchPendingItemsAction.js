/**
 * fetches the pending items
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} contains the pending items
 */
export const fetchPendingItemsAction = ({ applicationContext, props }) => {
  const { judge } = props;

  const pendingItems = applicationContext
    .getUseCases()
    .fetchPendingItemsInteractor({
      applicationContext,
      judge,
    });

  return { pendingItems };
};
