import { BlockedFormattedCase } from '@web-client/presenter/computeds/blockedCasesReportHelper';
import { exportCsvBlockedCaseReportAction } from '@web-client/presenter/actions/Reports/BlockedCaseReport/exportCsvBlockedCaseReportAction';

export const exportCsvBlockedCaseReportSequence = [
  exportCsvBlockedCaseReportAction,
] as unknown as (props: { blockedCases: BlockedFormattedCase[] }) => {};
