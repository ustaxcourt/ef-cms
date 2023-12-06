import { clone } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';

/**
 * submit advanced search form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitOrderAdvancedSearchAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const searchParams = clone(get(state.advancedSearchForm.orderSearch));

  if (searchParams.docketNumber) {
    searchParams.docketNumber = trimDocketNumberSearch(
      applicationContext,
      searchParams.docketNumber,
    );
  }

  try {
    const searchResults = await applicationContext
      .getUseCases()
      .orderAdvancedSearchInteractor(applicationContext, {
        searchParams,
      });
    return { searchResults };
  } catch (err) {
    if (err.responseCode === 429) {
      const message =
        applicationContext.getConstants().ERROR_MAP_429[
          err.originalError.response.data.type
        ];
      store.set(state.alertError, message);
      return { searchResults: [] };
    } else {
      throw err;
    }
  }
};
