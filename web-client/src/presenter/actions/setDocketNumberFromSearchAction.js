import { state } from 'cerebral';
const docketNumberMatcher = /^(\d{3,5}-\d{2})[XPRWSL]?L?(.*)$/i;

export const trimDocketNumberSearch = searchTerm => {
  if (!searchTerm) {
    return '';
  }
  const match = docketNumberMatcher.exec(searchTerm.trim());
  const docketNumber =
    match && match.length > 1 && match[2] === '' ? match[1] : searchTerm;
  return docketNumber;
};

/**
 * sets the docket number from the search form in props
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function used for getting state.header.searchTerm
 * @returns {object} the docketNumber provided in the search term
 */
export const setDocketNumberFromSearchAction = ({ get }) => {
  const searchTerm = get(state.header.searchTerm);
  const docketNumber = trimDocketNumberSearch(searchTerm);
  return {
    docketNumber,
  };
};
