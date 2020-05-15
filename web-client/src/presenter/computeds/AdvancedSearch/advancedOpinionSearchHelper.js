import { paginationHelper } from './advancedSearchHelper';
import { state } from 'cerebral';

export const advancedOpinionSearchHelper = (get, applicationContext) => {
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
        formatOpinionSearchResultRecord(searchResult, applicationContext),
    );
  }

  return {
    ...paginatedResults,
    isPublic,
  };
};

export const formatOpinionSearchResultRecord = (result, applicationContext) => {
  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.filingDate, 'MMDDYY');

  result.caseTitle = applicationContext.getCaseTitle(result.caseCaption || '');

  result.docketNumberWithSuffix = `${result.docketNumber}${
    result.docketNumberSuffix ? result.docketNumberSuffix : ''
  }`;

  result.formattedJudgeName = applicationContext
    .getUtilities()
    .getJudgeLastName(result.judge);

  result.formattedDocumentType = result.documentType.split('-').pop().trim();

  return result;
};
