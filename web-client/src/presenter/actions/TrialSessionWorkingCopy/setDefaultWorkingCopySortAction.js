import { state } from 'cerebral';

/**
 * set the default sort for the working copy table
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get function
 */
export const setDefaultWorkingCopySortAction = ({ get, store }) => {
  const sort = get(state.trialSessionWorkingCopy.sort);
  const sortOrder = get(state.trialSessionWorkingCopy.sortOrder);

  if (!sort) {
    store.set(state.trialSessionWorkingCopy.sort, 'docket');
  }

  if (!sortOrder) {
    store.set(state.trialSessionWorkingCopy.sortOrder, 'asc');
  }
};
