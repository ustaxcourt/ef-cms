import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { without } from 'lodash';

export type FormattedReportEntry = {
  docketNumber: string;
  caseTitle: string;
  consolidatedIconTooltipText: string;
  inConsolidatedGroup: boolean;
  isLeadCase: boolean;
  associatedJudge?: string;
  status: string;
  [key: string]: unknown;
};

export const caseInventoryReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  caseStatuses: string[];
  formattedReportData: FormattedReportEntry[];
  judges: string[];
  resultCount: number;
  showResultsTable: boolean;
  showSelectFilterMessage: boolean;
  showNoResultsMessage: boolean;
  showJudgeColumn: boolean;
  showStatusColumn: boolean;
} => {
  const { CHIEF_JUDGE, CLOSED_CASE_STATUSES, STATUS_TYPES } =
    applicationContext.getConstants();
  const { formatCase } = applicationContext.getUtilities();

  const judges = (get(state.judges) || [])
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
    .sort();

  const { associatedJudge, status } = get(state.screenMetadata);

  const reportData = get(state.caseInventoryReportData.foundCases) || [];
  const user = get(state.user);

  const formattedReportData = reportData
    .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
    .map(item => formatCase(applicationContext, item, user));

  const resultCount = formattedReportData.length;

  let showResultsTable = false;
  let showSelectFilterMessage = false;
  let showNoResultsMessage = false;

  if (resultCount) {
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
    resultCount,
    showJudgeColumn: !associatedJudge,
    showNoResultsMessage,
    showResultsTable,
    showSelectFilterMessage,
    showStatusColumn: !status,
  };
};
