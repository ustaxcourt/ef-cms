import { compareCasesByDocketNumber } from './formattedTrialSessionDetails';
import { state } from 'cerebral';

export const advancedSearchHelper = (get, applicationContext) => {
  const countryType = get(state.form.countryType);
  const { CASE_SEARCH_PAGE_COUNT, COUNTRY_TYPES } = get(state.constants);
  const searchResults = get(state.searchResults);
  const currentPage = get(state.form.currentPage);

  let result = { showStateSelect: countryType === COUNTRY_TYPES.DOMESTIC };

  if (searchResults) {
    const US_STATES = get(state.constants.US_STATES);

    const formattedSearchResults = searchResults
      .sort(compareCasesByDocketNumber)
      .map(result => {
        result.contactPrimaryName =
          result.contactPrimary && result.contactPrimary.name;
        result.contactSecondaryName =
          result.contactSecondary && result.contactSecondary.name;

        result.formattedFiledDate = applicationContext
          .getUtilities()
          .formatDateString(result.filedDate, 'MMDDYY');

        result.docketNumberWithSuffix = `${result.docketNumber}${
          result.docketNumberSuffix ? result.docketNumberSuffix : ''
        }`;

        result.caseCaptionNames = applicationContext.getCaseCaptionNames(
          result.caseCaption || '',
        );

        result.fullStateName = US_STATES[result.contactPrimary.state];

        return result;
      });

    result = {
      ...result,
      formattedSearchResults: formattedSearchResults.slice(
        0,
        currentPage * CASE_SEARCH_PAGE_COUNT,
      ),
      searchResultsCount: searchResults.length,
      showNoMatches: searchResults.length === 0,
      showSearchResults: searchResults.length > 0,
      showLoadMore: searchResults.length > currentPage * CASE_SEARCH_PAGE_COUNT,
    };
  }

  return result;
};
