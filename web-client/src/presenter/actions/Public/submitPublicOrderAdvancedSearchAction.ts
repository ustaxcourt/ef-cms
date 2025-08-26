import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { clone } from 'lodash';
import { state } from '@web-client/presenter/app-public.cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';
import { DATE_RANGE_SEARCH_OPTIONS } from '@shared/business/entities/EntityConstants';

export const submitPublicOrderAdvancedSearchAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps<{}, ClientPublicApplicationContext>) => {
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
    const firstHalf = await applicationContext
      .getUseCases()
      .orderPublicSearchInteractor(applicationContext, {
        ...baseParams,
        from: 0,
        limit: 5000,
      });

    let combinedResults = [...firstHalf.results];

    if (firstHalf.results.length === 5000) {
      const secondHalf = await applicationContext
        .getUseCases()
        .orderPublicSearchInteractor(applicationContext, {
          ...baseParams,
          from: 5000,
          limit: 5000,
        });

      combinedResults = [...combinedResults, ...secondHalf.results];
    }

    return { searchResults: combinedResults };
  } catch (err: any) {
    if (err.responseCode === 429) {
      store.set(state.alertError, applicationContext.getConstants().ERROR_429);
      return { searchResults: [] };
    } else {
      throw err;
    }
  }
};
