import { state } from 'cerebral';
const docketNumberMatcher = /^(\d{3,5}-\d{2})[XPRWSL]?L?(.*)$/;

/**
 * sets the state.caseId based on what the search term in the input box was
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral get function used for getting state.searchTerm
 * @param {Object} providers.store the cerebral store used for setting the state.caseId
 * @returns {Object} the caseId set to the docketNumber provided in the search term
 */
export const setCaseIdFromSearchAction = ({ store, get }) => {
  const searchTerm = get(state.searchTerm);
  const match = docketNumberMatcher.exec(searchTerm.trim());
  const docketNumber =
    match && match.length > 1 && match[2] === '' ? match[1] : searchTerm;
  store.set(state.caseId, docketNumber);
  return {
    caseId: docketNumber,
  };
};
