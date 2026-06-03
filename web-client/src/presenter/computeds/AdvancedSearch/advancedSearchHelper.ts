import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { Case } from '@shared/business/entities/cases/Case';
import {
  CASE_SEARCH_PAGE_SIZE,
  COUNTRY_TYPES,
  MAX_CASE_SEARCH_RESULTS,
  US_STATES,
} from '@shared/business/entities/EntityConstants';
import { dateStringsCompared } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const formatSearchResultRecord = (
  result,
  { applicationContext }: { applicationContext: ClientApplicationContext },
) => {
  result.petitionerNames = result.petitionerNames || [];
  result.petitionerStateNames = result.petitionerStateNames || [];
  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt, 'MMDDYY');

  if (result.petitioners) {
    result.petitionerFullStateNames = result.petitioners.map(petitioner => {
      return {
        contactId: petitioner.contactId,
        state: US_STATES[petitioner.state] || petitioner.state,
      };
    });
  }

  result.caseTitle = applicationContext.getCaseTitle(result.caseCaption || '');

  return result;
};

export const advancedSearchHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const permissions = get(state.permissions);
  const countryType = get(
    state.advancedSearchForm.caseSearchByName.countryType,
  );

  const advancedSearchTab = get(state.advancedSearchTab);
  const searchResults = get(state.searchResults[advancedSearchTab]);
  const currentPage = get(state.advancedSearchForm.currentPage);
  const caseCurrentPaginationPage = get(state.caseCurrentPaginationPage) || 0;
  const caseSearchSort = get(state.caseSearchSort) || {};

  const result = {
    showPractitionerSearch: permissions?.MANAGE_PRACTITIONER_USERS,
    showStateSelect: countryType === COUNTRY_TYPES.DOMESTIC,
  };

  if (advancedSearchTab === 'practitioner') {
    return result;
  }

  if (searchResults) {
    if (advancedSearchTab === 'case') {
      const formattedSearchResults = getFormattedCaseSearchResults({
        applicationContext,
        searchResults,
        sortColumn: caseSearchSort.sortColumn,
        sortDirection: caseSearchSort.sortDirection,
      });
      const totalPages = Math.ceil(
        formattedSearchResults.length / CASE_SEARCH_PAGE_SIZE,
      );
      const paginatedResults = formattedSearchResults.slice(
        caseCurrentPaginationPage * CASE_SEARCH_PAGE_SIZE,
        caseCurrentPaginationPage * CASE_SEARCH_PAGE_SIZE +
          CASE_SEARCH_PAGE_SIZE,
      );

      Object.assign(result, {
        caseSearchSortColumn: caseSearchSort.sortColumn,
        caseSearchSortDirection: caseSearchSort.sortDirection,
        formattedSearchResults: paginatedResults,
        manyResults: MAX_CASE_SEARCH_RESULTS,
        numberOfResults: formattedSearchResults.length,
        searchResults: paginatedResults,
        searchResultsCount: formattedSearchResults.length,
        showLoadMore: false,
        showManyResultsMessage:
          formattedSearchResults.length >= MAX_CASE_SEARCH_RESULTS,
        showNoMatches: formattedSearchResults.length === 0,
        showSearchResults: formattedSearchResults.length > 0,
        sortOptions: getCaseSearchSortOptions(),
        totalPages,
      });

      return result;
    }

    const paginatedResults = paginationHelper(
      searchResults,
      currentPage,
      CASE_SEARCH_PAGE_SIZE,
    );

    paginatedResults.formattedSearchResults = paginatedResults.searchResults;

    const showManyResultsMessage =
      searchResults.length >= MAX_CASE_SEARCH_RESULTS;

    Object.assign(result, {
      ...paginatedResults,
      manyResults: MAX_CASE_SEARCH_RESULTS,
      showManyResultsMessage,
    });
  }

  return result;
};

const getCaseSearchSortOptions = (): { label: string; value: string }[] => [
  { label: 'Sort by Petitioner(s) (ascending)', value: 'petitionerNames|asc' },
  {
    label: 'Sort by Petitioner(s) (descending)',
    value: 'petitionerNames|desc',
  },
  { label: 'Sort by Docket No. (ascending)', value: 'docketNumber|asc' },
  { label: 'Sort by Docket No. (descending)', value: 'docketNumber|desc' },
  { label: 'Sort by Filed Date (ascending)', value: 'receivedAt|asc' },
  { label: 'Sort by Filed Date (descending)', value: 'receivedAt|desc' },
  { label: 'Sort by Case Title (ascending)', value: 'caseTitle|asc' },
  { label: 'Sort by Case Title (descending)', value: 'caseTitle|desc' },
  { label: 'Sort by State (ascending)', value: 'petitionerStateNames|asc' },
  { label: 'Sort by State (descending)', value: 'petitionerStateNames|desc' },
];

const getFormattedCaseSearchResults = ({
  applicationContext,
  searchResults,
  sortColumn,
  sortDirection,
}: {
  applicationContext: ClientApplicationContext;
  searchResults: any[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}): any[] => {
  const formattedResults = searchResults.map((searchResult, index) => ({
    ...formatSearchResultRecord(searchResult, { applicationContext }),
    resultIndex: index + 1,
  }));

  if (!sortColumn || !sortDirection) {
    return formattedResults;
  }

  return formattedResults.sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;

    if (sortColumn === 'resultIndex') {
      return (a.resultIndex - b.resultIndex) * direction;
    }

    if (sortColumn === 'docketNumber') {
      return Case.docketNumberSort(a.docketNumber, b.docketNumber) * direction;
    }

    if (sortColumn === 'receivedAt') {
      return dateStringsCompared(a.receivedAt, b.receivedAt) * direction;
    }

    const aValue = getCaseSearchSortValue(a, sortColumn);
    const bValue = getCaseSearchSortValue(b, sortColumn);

    return aValue.localeCompare(bValue) * direction;
  });
};

const getCaseSearchSortValue = (result: any, sortColumn: string): string => {
  if (sortColumn === 'petitionerNames') {
    return result.petitionerNames?.join(' ')?.toLowerCase() || '';
  }

  if (sortColumn === 'petitionerStateNames') {
    return result.petitionerStateNames?.join(' ')?.toLowerCase() || '';
  }

  return result[sortColumn]?.toString().toLowerCase() || '';
};

export const paginationHelper = (searchResults, currentPage, pageSize) => {
  if (!searchResults) {
    return {};
  }

  return {
    formattedSearchResults: [],
    numberOfResults: searchResults.length,
    searchResults: searchResults.slice(0, currentPage * pageSize),
    searchResultsCount: searchResults.length,
    showLoadMore: searchResults.length > currentPage * pageSize,
    showNoMatches: searchResults.length === 0,
    showSearchResults: searchResults.length > 0,
  };
};
