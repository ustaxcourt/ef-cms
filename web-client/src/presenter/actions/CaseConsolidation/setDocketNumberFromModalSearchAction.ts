import { state } from 'cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';

/**
 * sets the props.docketNumber based on what the search term in the input box was
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @returns {object} the docketNumber provided in the search term
 */
export const setDocketNumberFromModalSearchAction = ({
  applicationContext,
  get,
}) => {
  const searchTerm = get(state.modal.searchTerm);
  const docketNumber =
    searchTerm && trimDocketNumberSearch(applicationContext, searchTerm);
  return {
    docketNumber,
  };
};
