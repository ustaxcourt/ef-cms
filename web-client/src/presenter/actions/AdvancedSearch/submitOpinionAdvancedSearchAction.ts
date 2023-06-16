import { clone } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';

/**
 * submit advanced search form to search for opinions
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitOpinionAdvancedSearchAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const searchParams = clone(get(state.advancedSearchForm.opinionSearch));

  if (searchParams.docketNumber) {
    searchParams.docketNumber = trimDocketNumberSearch(
      applicationContext,
      searchParams.docketNumber,
    );
  }

  const opinionTypes = Object.keys(searchParams.opinionTypes).filter(
    opinionType => searchParams.opinionTypes[opinionType] === true,
  );

  try {
    const searchResults = await applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor(applicationContext, {
        searchParams: {
          ...searchParams,
          opinionTypes,
        },
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
