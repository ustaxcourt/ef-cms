import { state } from 'cerebral';

/**
 * toggle the sort for the pending report table
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get function
 */
export const togglePendingReportSortAction = ({ get, props, store }) => {
  const { sort } = props;
  const fromSort = get(state.screenMetadata.sort);
  const fromSortOrder = get(state.screenMetadata.sortOrder);

  const newSort = sort;
  let newSortOrder = 'asc';

  if (sort === fromSort) {
    newSortOrder = (fromSortOrder === 'desc' && 'asc') || 'desc';
  }

  store.set(state.screenMetadata.sort, newSort);
  store.set(state.screenMetadata.sortOrder, newSortOrder);
};
