import { state } from 'cerebral';

/* sets props.practitioners on state.advancedSearchForm.results
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get cerebral get function
 * @returns {object} contains the practitioners returned from the getPractitionersByNameInteractor use case
 */
export const setPractitionerResultsAction = async ({ props, store }) => {
  store.set(state.searchResults, props.practitioners);
};
