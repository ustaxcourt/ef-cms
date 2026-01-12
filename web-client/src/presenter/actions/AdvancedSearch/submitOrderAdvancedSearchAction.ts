import { clone } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { trimDocketNumberSearch } from '@web-client/presenter/actions/setDocketNumberFromSearchAction';
import {
  DATE_RANGE_SEARCH_OPTIONS,
  MAX_DOCUMENT_SEARCH_RESULTS,
} from '@shared/business/entities/EntityConstants';

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

  const baseParams = {
    ...searchParams,
    dateRange:
      searchParams.startDate || searchParams.endDate
        ? DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES
        : DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
  };

  try {
    const orderSearch = await applicationContext
      .getUseCases()
      .orderAdvancedSearchInteractor(applicationContext, {
        searchParams: {
          ...baseParams,
          limit: MAX_DOCUMENT_SEARCH_RESULTS,
        },
      });
    return { searchResults: orderSearch.results };
  } catch (err: any) {
    if (err.responseCode === 429) {
      store.set(state.alertError, applicationContext.getConstants().ERROR_429);
      return { searchResults: [] };
    }
    throw err;
  }
};
