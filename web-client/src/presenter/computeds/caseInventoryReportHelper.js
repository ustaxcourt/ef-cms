import { state } from 'cerebral';
import { without } from 'lodash';

export const caseInventoryReportHelper = (get, applicationContext) => {
  const { CASE_INVENTORY_PAGE_SIZE, CHIEF_JUDGE, STATUS_TYPES } =
    applicationContext.getConstants();
  const { formatCase } = applicationContext.getUtilities();

  const judges = (get(state.judges) || [])
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
    .sort();

  const { associatedJudge, page, status } = get(state.screenMetadata);

  let showResultsTable = false;
  let showSelectFilterMessage = false;
  let showNoResultsMessage = false;
  const resultCount = get(state.caseInventoryReportData.totalCount);
  if (resultCount) {
    showResultsTable = true;
  } else if (!associatedJudge && !status) {
    showSelectFilterMessage = true;
  } else {
    showNoResultsMessage = true;
  }

  const reportData = get(state.caseInventoryReportData.foundCases) || [];

  const formattedReportData = reportData
    .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
    .map(item => formatCase(applicationContext, item));

  let displayedCount =
    resultCount < CASE_INVENTORY_PAGE_SIZE
      ? resultCount
      : (page || 1) * CASE_INVENTORY_PAGE_SIZE;

  if (displayedCount > resultCount) {
    displayedCount = resultCount;
  }

  const notDisplayedCount = resultCount - displayedCount;
  const showLoadMoreButton = displayedCount < resultCount;

  let nextPageSize = CASE_INVENTORY_PAGE_SIZE;

  if (notDisplayedCount < CASE_INVENTORY_PAGE_SIZE) {
    nextPageSize = notDisplayedCount;
  }

  return {
    caseStatuses: without(Object.values(STATUS_TYPES), STATUS_TYPES.closed),
    formattedReportData,
    judges,
    nextPageSize,
    resultCount,
    showJudgeColumn: !associatedJudge,
    showLoadMoreButton,
    showNoResultsMessage,
    showResultsTable,
    showSelectFilterMessage,
    showStatusColumn: !status,
  };
};
