import { state } from 'cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';

/**
 * sets the docket number from the advanced search form in props
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @returns {object} the docketNumber provided in the search form
 */
export const setDocketNumberFromAdvancedSearchAction = ({
  applicationContext,
  get,
}) => {
  const searchTerm = get(
    state.advancedSearchForm.caseSearchByDocketNumber.docketNumber,
  );
  const docketNumber = trimDocketNumberSearch(applicationContext, searchTerm);
  return {
    docketNumber,
  };
};
