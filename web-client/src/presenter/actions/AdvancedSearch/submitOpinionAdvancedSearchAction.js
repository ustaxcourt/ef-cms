import { clone } from 'lodash';
import { state } from 'cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';

/**
 * submit advanced search form to search for opinions
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitOpinionAdvancedSearchAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const searchParams = clone(get(state.advancedSearchForm.opinionSearch));

  if (searchParams.docketNumber) {
    searchParams.docketNumber = trimDocketNumberSearch(
      applicationContext,
      searchParams.docketNumber,
    );
  }

  try {
    const searchResults = await applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor(applicationContext, {
        searchParams,
      });

    return { searchResults };
  } catch (err) {
    if (err.responseCode === 429) {
      store.set(state.alertError, {
        message: 'Please wait 1 minute before trying your search again.',
        title: "You've reached your search limit.",
      });
      return { searchResults: [] };
    } else {
      throw err;
    }
  }
};
