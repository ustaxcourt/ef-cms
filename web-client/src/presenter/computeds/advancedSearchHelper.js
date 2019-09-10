import { compareCasesByDocketNumber } from './formattedTrialSessionDetails';
import { state } from 'cerebral';

export const advancedSearchHelper = (get, applicationContext) => {
  const countryType = get(state.form.countryType);
  const COUNTRY_TYPES = get(state.constants.COUNTRY_TYPES);
  const searchResults = get(state.searchResults);

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

        result.fullStateNamePrimary =
          US_STATES[result.contactPrimary.state] || result.contactPrimary.state;
        if (
          result.contactSecondary &&
          result.contactSecondary.state &&
          result.contactPrimary.state !== result.contactSecondary.state
        ) {
          result.fullStateNameSecondary =
            US_STATES[result.contactSecondary.state] ||
            result.contactSecondary.state;
        }

        return result;
      });

    result = {
      ...result,
      formattedSearchResults,
      searchResultsCount: searchResults.length,
      showNoMatches: searchResults.length === 0,
      showSearchResults: searchResults.length > 0,
    };
  }

  return result;
};
