import { capitalize } from 'lodash';
import { paginationHelper } from './advancedSearchHelper';
import { state } from 'cerebral';

export const advancedDocumentSearchHelper = (get, applicationContext) => {
  let paginatedResults = {};
  const isPublic = get(state.isPublic);
  const advancedSearchTab = get(state.advancedSearchTab);
  const searchResults = get(state.searchResults[advancedSearchTab]);
  const { ADVANCED_SEARCH_TABS, DATE_RANGE_SEARCH_OPTIONS } =
    applicationContext.getConstants();
  const { MAX_SEARCH_RESULTS } = applicationContext.getConstants();

  const dateRangeType = get(
    state.advancedSearchForm[`${advancedSearchTab}Search`].dateRange,
  );

  const showDateRangePicker =
    dateRangeType === DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES;

  let showSealedIcon = true;
  let documentTypeVerbiage = capitalize(advancedSearchTab);

  if (advancedSearchTab === ADVANCED_SEARCH_TABS.OPINION) {
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
    numberOfResults: searchResults?.length,
    ...paginatedResults,
    documentTypeVerbiage,
    isPublic,
    manyResults: MAX_SEARCH_RESULTS,
    showDateRangePicker,
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

  result.numberOfPagesFormatted = result.numberOfPages ?? 'n/a';

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
