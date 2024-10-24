import { state } from '@web-client/presenter/app.cerebral';
import { without } from 'lodash';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const caseInventoryReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    CASE_INVENTORY_PAGE_SIZE,
    CHIEF_JUDGE,
    CLOSED_CASE_STATUSES,
    STATUS_TYPES,
  } = applicationContext.getConstants();
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
  const user = get(state.user);

  const formattedReportData = reportData
    .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
    .map(item => formatCase(applicationContext, item, user));

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
    caseStatuses: without(Object.values(STATUS_TYPES), ...CLOSED_CASE_STATUSES),
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
