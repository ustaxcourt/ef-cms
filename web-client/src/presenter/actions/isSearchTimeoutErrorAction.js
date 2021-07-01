import { state } from 'cerebral';

/**
 * determines whether a timeout occurred while user is on advanced search page
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence
 */

export const isSearchTimeoutErrorAction = async ({ get, path }) => {
  const currentPage = get(state.currentPage);

  if (currentPage === 'AdvancedSearch') {
    return path.yes();
  } else {
    return path.no();
  }
};
