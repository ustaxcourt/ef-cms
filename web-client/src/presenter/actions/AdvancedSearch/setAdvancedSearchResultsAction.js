import { state } from 'cerebral';

/* sets props.searchResults on state.searchResults[advancedSearchTab]
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store
 */
export const setAdvancedSearchResultsAction = ({ get, props, store }) => {
  const tabName = get(state.advancedSearchTab) || 'case';
  store.set(state.searchResults[tabName], props.searchResults);
};
