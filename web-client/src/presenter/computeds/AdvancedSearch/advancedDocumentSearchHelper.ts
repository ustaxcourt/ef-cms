import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { Get } from 'cerebral';
import { capitalize } from 'lodash';
import { paginationHelper } from './advancedSearchHelper';
import { state } from '@web-client/presenter/app.cerebral';
import {
  calculateISODate,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { dateStringsCompared } from '@shared/business/utilities/DateHandler';
import { Case } from '@shared/business/entities/cases/Case';
import { COURT_ISSUED_EVENTS } from '@shared/business/entities/docketEntry/courtIssuedEventCodes';

export const advancedDocumentSearchHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  let paginatedResults: any = {};
  const { role } = get(state.user);
  const advancedSearchTab = get(state.advancedSearchTab);
  const searchResults = get(state.searchResults[advancedSearchTab]);
  const sortColumn = get(state.documentSearchSort.sortColumn);
  const sortDirection = get(state.documentSearchSort.sortDirection);

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

  const formattedJudges = get(state.legacyAndCurrentJudges);
  formattedJudges.forEach(judge => {
    judge.lastName = applicationContext
      .getUtilities()
      .getJudgeLastName(judge.judgeFullName);
  });

  if (advancedSearchTab === ADVANCED_SEARCH_TABS.OPINION) {
    documentTypeVerbiage = `${documentTypeVerbiage} Type` as Capitalize<
      Lowercase<string>
    >;
  }

  if (searchResults) {
    // formatted;
    paginatedResults = paginationHelper(
      searchResults,
      get(state.advancedSearchForm.currentPage),
      applicationContext.getConstants().MAX_ELASTICSEARCH_PAGINATION,
    );

    paginatedResults.formattedSearchResults =
      paginatedResults.searchResults.map(searchResult =>
        formatDocumentSearchResultRecord(searchResult, advancedSearchTab, {
          applicationContext,
        }),
      );

    // Sorting logic
    paginatedResults.formattedSearchResults =
      paginatedResults.formattedSearchResults.sort((a, b) => {
        let aValue = a[sortColumn] || '';
        let bValue = b[sortColumn] || '';

        const direction = sortDirection === 'asc' ? 1 : -1;

        if (sortColumn === 'docketNumber') {
          // Use custom docket number sorting
          return Case.docketNumberSort(aValue, bValue) * direction;
        }

        if (sortColumn === 'formattedFiledDate') {
          // Use date comparison for filingDate
          return dateStringsCompared(a.filingDate, b.filingDate) * direction;
        }

        if (sortColumn === 'numberOfPages') {
          return (Number(aValue) - Number(bValue)) * direction;
        }

        // Fallback to string comparison
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();

        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return direction;

        return 0; // Values are equal
      });
  }

  const showManyResultsMessage = !!(
    searchResults && searchResults.length >= MAX_SEARCH_RESULTS
  );

  return {
    numberOfResults: searchResults?.length,
    ...paginatedResults,
    //formattedSearchResults: searchResults,
    formattedSearchResults: paginatedResults.formattedSearchResults,
    documentTypeVerbiage,
    formattedJudges,
    isInternalUser,
    manyResults: MAX_SEARCH_RESULTS,
    showDateRangePicker,
    showManyResultsMessage,
    maxDate: calculateISODate({
      dateString: applicationContext.getUtilities().createISODateString(),
      howMuch: 0,
      units: 'days',
    }),
    sortColumn,
    sortDirection,
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
    STANDING_PRETRIAL_EVENT_CODES,
  } = applicationContext.getConstants();

  result.documentType = getDocumentTypeByEventCode(result.eventCode);

  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.filingDate, FORMATS.MMDDYYYY);

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
    DocketEntry.isOrder(result.eventCode) ||
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

function getDocumentTypeByEventCode(eventCode: string): string | undefined {
  const eventInfo = COURT_ISSUED_EVENTS.find(eventInfo => {
    return eventInfo.eventCode === eventCode;
  });
  return eventInfo && eventInfo.documentType;
}
