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

  result.docketNumberWithSuffix = `${result.docketNumber}${
    result.docketNumberSuffix ? result.docketNumberSuffix : ''
  }`;

  result.caseCaptionNames = applicationContext.getCaseCaptionNames(
    result.caseCaption || '',
  );

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
  const countryType = get(state.advancedSearchForm.countryType);
  const { CASE_SEARCH_PAGE_SIZE, COUNTRY_TYPES } = get(state.constants);
  const searchResults = get(state.searchResults);
  const currentPage = get(state.advancedSearchForm.currentPage);

  let result = { showStateSelect: countryType === COUNTRY_TYPES.DOMESTIC };

  if (searchResults) {
    const formattedSearchResults = searchResults
      .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
      .map(result => formatSearchResultRecord(result, { applicationContext }));

    result = {
      ...result,
      formattedSearchResults: formattedSearchResults.slice(
        0,
        currentPage * CASE_SEARCH_PAGE_SIZE,
      ),
      searchResultsCount: searchResults.length,
      showLoadMore: searchResults.length > currentPage * CASE_SEARCH_PAGE_SIZE,
      showNoMatches: searchResults.length === 0,
      showSearchResults: searchResults.length > 0,
    };
  }

  return result;
};
