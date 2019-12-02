import { state } from 'cerebral';
import { trimDocketNumberSearch } from '../setCaseIdFromSearchAction';

/**
 * sets the state.caseId based on what the search term in the input box was
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function used for getting state.searchTerm
 * @param {object} providers.store the cerebral store used for setting the state.caseId
 * @returns {object} the caseId set to the docketNumber provided in the search term
 */
export const setDocketNumberFromAdvancedSearchAction = ({ get, store }) => {
  const searchTerm = get(state.docketNumberSearchForm.docketNumber);
  const docketNumber = trimDocketNumberSearch(searchTerm);
  //TODO - refactor this. why are we setting state.caseId to docketNumber?
  //also see setCaseIdFromSearchAction and navigateToCaseDetailAction
  store.set(state.caseId, docketNumber);
  return {
    caseId: docketNumber,
  };
};
