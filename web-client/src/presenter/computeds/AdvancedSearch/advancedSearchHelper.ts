import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import {
  advancedCaseSearchHelper,
  type AdvancedCaseSearchHelperResult,
  CASE_SEARCH_SORT_OPTIONS,
  type CaseSearchSortDirection,
  DEFAULT_CASE_SEARCH_SORT,
} from './advancedCaseSearchHelper';
import { COUNTRY_TYPES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

type AdvancedSearchHelperResult = AdvancedCaseSearchHelperResult & {
  caseSearchMobileSortValue: string;
  caseSearchSortColumnForDisplay: string;
  caseSearchSortDirectionForDisplay: CaseSearchSortDirection;
  showNoMatches: boolean;
  showPractitionerSearch: boolean | undefined;
  showSearchResults: boolean;
  showStateSelect: boolean;
};

export const advancedSearchHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): AdvancedSearchHelperResult => {
  const permissions = get(state.permissions);
  const countryType = get(
    state.advancedSearchForm.caseSearchByName.countryType,
  );
  const advancedSearchTab = get(state.advancedSearchTab);
  const searchResults = get(state.searchResults[advancedSearchTab]);
  const caseCurrentPaginationPage = get(state.caseCurrentPaginationPage) || 0;
  const caseSearchSort = get(state.caseSearchSort) || {};

  let result: AdvancedSearchHelperResult = {
    caseSearchMobileSortValue: `${DEFAULT_CASE_SEARCH_SORT.sortColumn}|${DEFAULT_CASE_SEARCH_SORT.sortDirection}`,
    caseSearchSortColumnForDisplay: DEFAULT_CASE_SEARCH_SORT.sortColumn,
    caseSearchSortDirectionForDisplay: DEFAULT_CASE_SEARCH_SORT.sortDirection,
    formattedSearchResults: [],
    numberOfResults: 0,
    showManyResultsMessage: false,
    showNoMatches: false,
    showPractitionerSearch: permissions?.MANAGE_PRACTITIONER_USERS,
    showSearchResults: false,
    showStateSelect: countryType === COUNTRY_TYPES.DOMESTIC,
    sortOptions: CASE_SEARCH_SORT_OPTIONS,
    totalPages: 0,
  };

  if (advancedSearchTab === 'practitioner') {
    return result;
  }

  if (advancedSearchTab === 'case' && searchResults) {
    const caseSearchHelperResult = advancedCaseSearchHelper({
      applicationContext,
      caseCurrentPaginationPage,
      caseSearchSort,
      searchResults,
    });

    result = {
      ...result,
      ...caseSearchHelperResult,
    };
  }

  return result;
};
