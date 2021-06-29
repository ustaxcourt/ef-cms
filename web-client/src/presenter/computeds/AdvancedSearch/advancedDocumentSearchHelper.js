import { capitalize } from 'lodash';
import { paginationHelper } from './advancedSearchHelper';
import { state } from 'cerebral';

export const advancedDocumentSearchHelper = (get, applicationContext) => {
  let paginatedResults = {};
  const isPublic = get(state.isPublic);
  const advancedSearchTab = get(state.advancedSearchTab);
  const searchResults = get(state.searchResults[advancedSearchTab]);
  const searchTabs = applicationContext.getConstants().ADVANCED_SEARCH_TABS;
  const { MAX_SEARCH_RESULTS } = applicationContext.getConstants();

  let showSealedIcon = true;
  let documentTypeVerbiage = capitalize(advancedSearchTab);

  if (advancedSearchTab === searchTabs.OPINION) {
    showSealedIcon = false;
    documentTypeVerbiage = `${documentTypeVerbiage} Type`;
  }

  if (searchResults) {
    paginatedResults = paginationHelper(
      searchResults,
      get(state.advancedSearchForm.currentPage),
      applicationContext.getConstants().CASE_SEARCH_PAGE_SIZE,
    );

    paginatedResults.formattedSearchResults =
      paginatedResults.searchResults.map(searchResult =>
        formatDocumentSearchResultRecord(searchResult, advancedSearchTab, {
          applicationContext,
        }),
      );
  }

  const showManyResultsMessage = !!(
    searchResults && searchResults.length >= MAX_SEARCH_RESULTS
  );

  return {
    ...paginatedResults,
    documentTypeVerbiage,
    isPublic,
    manyResults: MAX_SEARCH_RESULTS,
    showManyResultsMessage,
    showSealedIcon,
  };
};

export const formatDocumentSearchResultRecord = (
  result,
  advancedSearchTab,
  { applicationContext },
) => {
  const { OPINION_EVENT_CODES_WITH_BENCH_OPINION, ORDER_EVENT_CODES } =
    applicationContext.getConstants();

  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.filingDate, 'MMDDYY');

  result.caseTitle = applicationContext.getCaseTitle(result.caseCaption || '');

  const searchTabs = applicationContext.getConstants().ADVANCED_SEARCH_TABS;
  if (advancedSearchTab === searchTabs.OPINION) {
    result.documentTitle = result.documentType;
  }

  if (OPINION_EVENT_CODES_WITH_BENCH_OPINION.includes(result.eventCode)) {
    result.formattedJudgeName = result.judge
      ? applicationContext.getUtilities().getJudgeLastName(result.judge)
      : '';
  } else if (ORDER_EVENT_CODES.includes(result.eventCode)) {
    result.formattedSignedJudgeName = result.signedJudgeName
      ? applicationContext
          .getUtilities()
          .getJudgeLastName(result.signedJudgeName)
      : '';
  }

  return result;
};
