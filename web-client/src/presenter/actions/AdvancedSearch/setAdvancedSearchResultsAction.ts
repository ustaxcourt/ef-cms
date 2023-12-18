import { state } from '@web-client/presenter/app.cerebral';

/* sets props.searchResults on state.searchResults[advancedSearchTab]
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store
 */
export const setAdvancedSearchResultsAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const tabName = get(state.advancedSearchTab);
  store.set(state.searchResults[tabName], props.searchResults); // todo: type searchResults
};
