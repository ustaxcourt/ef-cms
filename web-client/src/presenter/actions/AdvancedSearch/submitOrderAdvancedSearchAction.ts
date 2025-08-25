import { clone } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';
import { DATE_RANGE_SEARCH_OPTIONS } from '@shared/business/entities/EntityConstants';
// import { search } from '@web-api/persistence/elasticsearch/searchClient';

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
        searchParams: {
          ...searchParams,
          dateRange:
            searchParams.startDate || searchParams.endDate
              ? DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES
              : DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
        },
      });
    return { searchResults }; // Object with a results and totalCount
  } catch (err: any) {
    if (err.responseCode === 429) {
      store.set(state.alertError, applicationContext.getConstants().ERROR_429);
      return { searchResults: [] };
    } else {
      throw err;
    }
  }
};
