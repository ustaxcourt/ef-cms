import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { capitalize } from 'lodash';
import { paginationHelper } from './advancedSearchHelper';
import { state } from '@web-client/presenter/app.cerebral';

export const advancedDocumentSearchHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  let paginatedResults = {};
  const { role } = get(state.user);
  const advancedSearchTab = get(state.advancedSearchTab);
  const searchResults = get(state.searchResults[advancedSearchTab]);

  const {
    ADVANCED_SEARCH_TABS,
    DATE_RANGE_SEARCH_OPTIONS,
    MAX_SEARCH_RESULTS,
  } = applicationContext.getConstants();

  const isInternalUser = applicationContext.getUtilities().isInternalUser(role);

  const dateRangeType = get(
    state.advancedSearchForm[`${advancedSearchTab}Search`].dateRange,
  );

  const showDateRangePicker =
    dateRangeType === DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES;

  let documentTypeVerbiage = capitalize(advancedSearchTab);

  let formattedJudges = get(state.legacyAndCurrentJudges);
  formattedJudges.forEach(judge => {
    judge.lastName = applicationContext
      .getUtilities()
      .getJudgeLastName(judge.judgeFullName);
  });

  if (advancedSearchTab === ADVANCED_SEARCH_TABS.OPINION) {
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
    formattedJudges,
    isInternalUser,
    manyResults: MAX_SEARCH_RESULTS,
    showDateRangePicker,
    showManyResultsMessage,
  };
};

export const formatDocumentSearchResultRecord = (
  result,
  advancedSearchTab,
  { applicationContext },
) => {
  const {
    ADVANCED_SEARCH_TABS,
    BENCH_OPINION_EVENT_CODE,
    OPINION_EVENT_CODES_WITHOUT_BENCH_OPINION,
    ORDER_EVENT_CODES,
    STANDING_PRETRIAL_EVENT_CODES,
  } = applicationContext.getConstants();

  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.filingDate, 'MMDDYY');

  result.caseTitle = applicationContext.getCaseTitle(result.caseCaption || '');

  result.showSealedIcon =
    (result.isCaseSealed || result.isDocketEntrySealed) &&
    advancedSearchTab === ADVANCED_SEARCH_TABS.ORDER;

  result.numberOfPagesFormatted = result.numberOfPages ?? 'n/a';

  if (advancedSearchTab === ADVANCED_SEARCH_TABS.OPINION) {
    result.documentTitle = result.documentType;
  }

  if (OPINION_EVENT_CODES_WITHOUT_BENCH_OPINION.includes(result.eventCode)) {
    result.formattedJudgeName = result.judge
      ? applicationContext.getUtilities().getJudgeLastName(result.judge)
      : '';
  } else if (STANDING_PRETRIAL_EVENT_CODES.includes(result.eventCode)) {
    result.formattedJudgeName = result.judge;
  } else if (
    ORDER_EVENT_CODES.includes(result.eventCode) ||
    result.eventCode === BENCH_OPINION_EVENT_CODE
  ) {
    result.formattedJudgeName = result.signedJudgeName
      ? applicationContext
          .getUtilities()
          .getJudgeLastName(result.signedJudgeName)
      : '';
  }

  return result;
};
