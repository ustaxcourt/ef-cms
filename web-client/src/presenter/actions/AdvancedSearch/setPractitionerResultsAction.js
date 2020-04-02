import { state } from 'cerebral';

/* sets props.practitioners on state.searchResults
 *
 * @param {object} providers the providers object
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store
 */
export const setPractitionerResultsAction = async ({ props, store }) => {
  store.set(state.searchResults, props.practitioners);
};
