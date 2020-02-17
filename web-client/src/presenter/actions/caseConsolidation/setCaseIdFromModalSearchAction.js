import { state } from 'cerebral';
import { trimDocketNumberSearch } from '../setCaseIdFromSearchAction';

/**
 * sets the props.caseId based on what the search term in the input box was
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function used for getting state.searchTerm
 * @returns {object} the caseId set to the docketNumber provided in the search term
 */
export const setCaseIdFromModalSearchAction = ({ get }) => {
  const searchTerm = get(state.modal.searchTerm);
  const docketNumber = searchTerm && trimDocketNumberSearch(searchTerm);
  return {
    caseId: docketNumber,
  };
};
