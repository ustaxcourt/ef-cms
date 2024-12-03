import { ClientApplicationContext } from '@web-client/applicationContext';
import { FormattedCaseInventoryReportEntry } from '@shared/business/utilities/getFormattedCaseDetail';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { without } from 'lodash';
export const caseInventoryReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  caseStatuses: string[];
  formattedReportData: FormattedCaseInventoryReportEntry[];
  judges: string[];
  pageCount: number;
  showResultsTable: boolean;
  showSelectFilterMessage: boolean;
  showNoResultsMessage: boolean;
  showJudgeColumn: boolean;
  showStatusColumn: boolean;
} => {
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

  const { associatedJudge, status } = get(state.screenMetadata);

  const reportData =
    get(state.caseInventoryReportData.foundCasesForCurrentPage) || [];
  const user = get(state.user);

  const formattedReportData = reportData
    .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
    .map(item => formatCase(applicationContext, item, user));

  const foundCasesTotalCount = get(
    state.caseInventoryReportData.foundCasesTotalCount,
  );
  const pageCount = Math.ceil(foundCasesTotalCount / CASE_INVENTORY_PAGE_SIZE);

  let showResultsTable = false;
  let showSelectFilterMessage = false;
  let showNoResultsMessage = false;

  if (foundCasesTotalCount) {
    showResultsTable = true;
  } else if (!associatedJudge && !status) {
    showSelectFilterMessage = true;
  } else {
    showNoResultsMessage = true;
  }

  return {
    caseStatuses: without(Object.values(STATUS_TYPES), ...CLOSED_CASE_STATUSES),
    formattedReportData,
    judges,
    pageCount,
    showJudgeColumn: !associatedJudge,
    showNoResultsMessage,
    showResultsTable,
    showSelectFilterMessage,
    showStatusColumn: !status,
  };
};
