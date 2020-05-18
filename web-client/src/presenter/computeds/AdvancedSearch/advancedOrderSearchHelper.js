import { paginationHelper } from './advancedSearchHelper';
import { state } from 'cerebral';

export const advancedOrderSearchHelper = (get, applicationContext) => {
  let paginatedResults = {};
  const searchResults = get(state.searchResults);
  const isPublic = get(state.isPublic);

  if (searchResults) {
    paginatedResults = paginationHelper(
      searchResults,
      get(state.advancedSearchForm.currentPage),
      applicationContext.getConstants().CASE_SEARCH_PAGE_SIZE,
    );

    paginatedResults.formattedSearchResults = paginatedResults.searchResults.map(
      searchResult =>
        formatOrderSearchResultRecord(searchResult, { applicationContext }),
    );
  }

  return {
    ...paginatedResults,
    isPublic,
  };
};

export const formatOrderSearchResultRecord = (
  result,
  { applicationContext },
) => {
  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.filingDate, 'MMDDYY');

  result.caseTitle = applicationContext.getCaseTitle(result.caseCaption || '');

  result.docketNumberWithSuffix = `${result.docketNumber}${
    result.docketNumberSuffix ? result.docketNumberSuffix : ''
  }`;

  result.formattedSignedJudgeName = result.signedJudgeName
    ? applicationContext.getUtilities().getJudgeLastName(result.signedJudgeName)
    : '';

  result.formattedJudgeName = result.judge
    ? applicationContext.getUtilities().getJudgeLastName(result.judge)
    : '';

  return result;
};
