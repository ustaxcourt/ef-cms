import { state } from 'cerebral';

export const caseInventoryReportHelper = (get, applicationContext) => {
  const {
    CASE_INVENTORY_PAGE_SIZE,
    STATUS_TYPES,
  } = applicationContext.getConstants();
  const { formatCase } = applicationContext.getUtilities();

  const judges = (get(state.judges) || [])
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat('Chief Judge')
    .sort();

  const { associatedJudge, page, status } = get(state.screenMetadata);

  const resultCount = get(state.caseInventoryReportData.totalCount);

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
    caseStatuses: Object.values(STATUS_TYPES),
    formattedReportData,
    judges,
    nextPageSize,
    resultCount,
    showJudgeColumn: !associatedJudge,
    showLoadMoreButton,
    showStatusColumn: !status,
  };
};
