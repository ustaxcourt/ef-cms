import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { clone } from 'lodash';
import { state } from '@web-client/presenter/app-public.cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';
import {
  DATE_RANGE_SEARCH_OPTIONS,
  MAX_DOCUMENT_SEARCH_RESULTS,
} from '@shared/business/entities/EntityConstants';

export const submitPublicOpinionAdvancedSearchAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps<{}, ClientPublicApplicationContext>) => {
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

  const baseParams = {
    ...searchParams,
    opinionTypes,
    dateRange:
      searchParams.startDate || searchParams.endDate
        ? DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES
        : DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
  };

  try {
    const firstChunk = await applicationContext
      .getUseCases()
      .opinionPublicSearchInteractor(applicationContext, {
        searchParams: {
          ...baseParams,
          limit: MAX_DOCUMENT_SEARCH_RESULTS,
        },
      });

    return { searchResults: firstChunk.results };
  } catch (err: any) {
    if (err.responseCode === 429) {
      store.set(state.alertError, applicationContext.getConstants().ERROR_429);
      return { searchResults: [] };
    }
    throw err;
  }
};
