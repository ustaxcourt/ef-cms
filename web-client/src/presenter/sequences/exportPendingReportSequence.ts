import { chooseExportPendingReportMethodAction } from '@web-client/presenter/actions/chooseExportPendingReportMethodAction';
import { exportPendingReportAction } from '@web-client/presenter/actions/exportPendingReportAction';
import { exportWithCSVSAction } from '@web-client/presenter/actions/exportWithCSVSAction';
import { exportWithE2CSVAction } from '@web-client/presenter/actions/exportWithE2CSVAction';

export const exportPendingReportSequence = [
  chooseExportPendingReportMethodAction,
  {
    base: [exportPendingReportAction],
    csvs: [exportWithCSVSAction],
    e2csv: [exportWithE2CSVAction],
  },
];
