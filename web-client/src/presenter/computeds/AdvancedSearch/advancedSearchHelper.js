import { state } from 'cerebral';

export const formatSearchResultRecord = (result, { applicationContext }) => {
  const { US_STATES } = applicationContext.getConstants();

  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt, 'MMDDYY');

  result.caseTitle = applicationContext.getCaseTitle(result.caseCaption || '');

  if (result.petitioners) {
    result.petitionerFullStateNames = result.petitioners.map(petitioner => {
      return {
        contactId: petitioner.contactId,
        state: US_STATES[petitioner.state] || petitioner.state,
      };
    });
  }

  return result;
};

export const advancedSearchHelper = (get, applicationContext) => {
  const permissions = get(state.permissions) || {};
  const countryType = get(
    state.advancedSearchForm.caseSearchByName.countryType,
  );
  const { CASE_SEARCH_PAGE_SIZE, COUNTRY_TYPES } =
    applicationContext.getConstants();
  const advancedSearchTab = get(state.advancedSearchTab) || 'case'; // 'case' is default tab, but sometimes undefined in state.
  const searchResults = get(state.searchResults[advancedSearchTab]);
  const currentPage = get(state.advancedSearchForm.currentPage);
  const result = {
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
      paginatedResults.formattedSearchResults =
        paginatedResults.searchResults.map(searchResult =>
          formatSearchResultRecord(searchResult, { applicationContext }),
        );
    } else {
      paginatedResults.formattedSearchResults = paginatedResults.searchResults;
    }

    const { MAX_SEARCH_RESULTS } = applicationContext.getConstants();

    const showManyResultsMessage = searchResults.length >= MAX_SEARCH_RESULTS;

    Object.assign(result, {
      ...paginatedResults,
      manyResults: MAX_SEARCH_RESULTS,
      showManyResultsMessage,
    });
  }

  return result;
};

export const paginationHelper = (searchResults, currentPage, pageSize) => {
  if (!searchResults) {
    return {};
  }

  return {
    numberOfResults: searchResults.length,
    searchResults: searchResults.slice(0, currentPage * pageSize),
    searchResultsCount: searchResults.length,
    showLoadMore: searchResults.length > currentPage * pageSize,
    showNoMatches: searchResults.length === 0,
    showSearchResults: searchResults.length > 0,
  };
};
