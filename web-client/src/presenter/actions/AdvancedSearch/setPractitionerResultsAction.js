import { state } from 'cerebral';

/* sets props.practitioners on state.searchResults
 *
 * @param {object} providers the providers object
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store
 */
export const setPractitionerResultsAction = async ({ props, store }) => {
  // fixme, use tab set in state
  store.set(state.searchResults.practitioner, props.practitioners);
};
