import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { clone } from 'lodash';
import { state } from '@web-client/presenter/app-public.cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';
import { DATE_RANGE_SEARCH_OPTIONS } from '@shared/business/entities/EntityConstants';

/**
 * submit public opinion advanced search form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store
 * @returns {Promise} async action
 */
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

  try {
    const searchResults = await applicationContext
      .getUseCases()
      .opinionPublicSearchInteractor(applicationContext, {
        searchParams: {
          ...searchParams,
          opinionTypes,
          dateRange:
            searchParams.startDate || searchParams.endDate
              ? DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES
              : DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
        },
      });

    return { searchResults };
  } catch (err: any) {
    if (err.responseCode === 429) {
      store.set(state.alertError, applicationContext.getConstants().ERROR_429);
      return { searchResults: [] };
    } else {
      throw err;
    }
  }
};
