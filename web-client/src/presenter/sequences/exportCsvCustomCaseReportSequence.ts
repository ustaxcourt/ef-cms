import { exportCsvFileAction } from '@web-client/presenter/actions/CaseInventoryReport/exportCsvFileAction';
import { getCustomCaseReportCsvDataAction } from '@web-client/presenter/actions/CaseInventoryReport/getCustomCaseReportCsvDataAction';

export const exportCsvCustomCaseReportSequence = [
  getCustomCaseReportCsvDataAction,
  exportCsvFileAction,
];
