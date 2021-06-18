import { clone } from 'lodash';
import { state } from 'cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';

/**
 * submit advanced search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitOrderAdvancedSearchAction = async ({
  applicationContext,
  get,
}) => {
  const searchParams = clone(get(state.advancedSearchForm.orderSearch));

  if (searchParams.docketNumber) {
    searchParams.docketNumber = trimDocketNumberSearch(
      applicationContext,
      searchParams.docketNumber,
    );
  }

  const searchResults = await applicationContext
    .getUseCases()
    .orderAdvancedSearchInteractor(applicationContext, {
      searchParams,
    });

  return { searchResults };
};
