import { state } from 'cerebral';

/**
 * clears the search term used for case search
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearSearchTermAction = ({ store }) => {
  store.set(state.header.searchTerm, '');
};
