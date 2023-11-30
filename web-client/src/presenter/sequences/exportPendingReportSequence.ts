import { chooseExportPendingReportMethodAction } from '@web-client/presenter/actions/chooseExportPendingReportMethodAction';
import { exportPendingReportAction } from '@web-client/presenter/actions/exportPendingReportAction copy';

export const exportPendingReportSequence = [
  chooseExportPendingReportMethodAction,
  {
    base: [exportPendingReportAction],
    csvs: [exportWithCSVSAction],
    e2csv: [exportWithE2CSVAction],
  },
];
