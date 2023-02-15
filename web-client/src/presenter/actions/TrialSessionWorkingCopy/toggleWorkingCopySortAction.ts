import { state } from 'cerebral';

/**
 * toggle the sort for the working copy table
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get function
 */
export const toggleWorkingCopySortAction = ({ get, props, store }) => {
  const { sort } = props;
  const fromSort = get(state.trialSessionWorkingCopy.sort);
  const fromSortOrder = get(state.trialSessionWorkingCopy.sortOrder);

  const newSort = sort;
  let newSortOrder = 'asc';

  if (sort === fromSort) {
    newSortOrder = (fromSortOrder === 'desc' && 'asc') || 'desc';
  }

  store.set(state.trialSessionWorkingCopy.sort, newSort);
  store.set(state.trialSessionWorkingCopy.sortOrder, newSortOrder);
};
