import { exportCsvFileAction } from '@web-client/presenter/actions/CaseInventoryReport/exportCsvFileAction';
import { getAllCustomCaseReportDataAction } from '@web-client/presenter/actions/CaseInventoryReport/getAllCustomCaseReportDataAction';

export const exportCsvCustomCaseReportSequence = [
  getAllCustomCaseReportDataAction,
  exportCsvFileAction,
];
