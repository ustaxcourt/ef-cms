import { state } from 'cerebral';

export const formatSearchResultRecord = (result, { applicationContext }) => {
  const { US_STATES } = applicationContext.getConstants();
  result.contactPrimary = result.contactPrimary || {};
  result.contactPrimaryName =
    result.contactPrimary && result.contactPrimary.name;
  result.contactSecondaryName =
    result.contactSecondary && result.contactSecondary.name;

  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt, 'MMDDYY');

  result.caseTitle = applicationContext.getCaseTitle(result.caseCaption || '');

  result.fullStateNamePrimary =
    US_STATES[result.contactPrimary.state] || result.contactPrimary.state;

  if (
    result.contactSecondary &&
    result.contactSecondary.state &&
    result.contactPrimary.state !== result.contactSecondary.state
  ) {
    result.fullStateNameSecondary =
      US_STATES[result.contactSecondary.state] || result.contactSecondary.state;
  }

  return result;
};

export const advancedSearchHelper = (get, applicationContext) => {
  const permissions = get(state.permissions) || {};
  const countryType = get(
    state.advancedSearchForm.caseSearchByName.countryType,
  );
  const {
    CASE_SEARCH_PAGE_SIZE,
    COUNTRY_TYPES,
  } = applicationContext.getConstants();
  const searchResults = get(state.searchResults);
  const advancedSearchTab = get(state.advancedSearchTab) || 'case'; // 'case' is default tab, but sometimes undefined in state.
  const currentPage = get(state.advancedSearchForm.currentPage);
  let result = {
    showPractitionerSearch: permissions.MANAGE_PRACTITIONER_USERS,
    showStateSelect: countryType === COUNTRY_TYPES.DOMESTIC,
  };

  if (searchResults) {
    const paginatedResults = paginationHelper(
      searchResults,
      currentPage,
      CASE_SEARCH_PAGE_SIZE,
    );

    if (advancedSearchTab === 'case') {
      paginatedResults.formattedSearchResults = paginatedResults.searchResults.map(
        searchResult =>
          formatSearchResultRecord(searchResult, { applicationContext }),
      );
    } else {
      paginatedResults.formattedSearchResults = paginatedResults.searchResults;
    }

    result = {
      ...result,
      ...paginatedResults,
    };
  }

  return result;
};

export const paginationHelper = (searchResults, currentPage, pageSize) => {
  if (!searchResults) {
    return {};
  }

  return {
    searchResults: searchResults.slice(0, currentPage * pageSize),
    searchResultsCount: searchResults.length,
    showLoadMore: searchResults.length > currentPage * pageSize,
    showNoMatches: searchResults.length === 0,
    showSearchResults: searchResults.length > 0,
  };
};
