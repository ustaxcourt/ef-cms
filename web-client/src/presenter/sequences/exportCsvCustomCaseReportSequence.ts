import { exportCsvFileAction } from '@web-client/presenter/actions/CaseInventoryReport/exportCsvFileAction';
import { formatCustomCaseReportDataForCsvAction } from '@web-client/presenter/actions/CaseInventoryReport/formatCustomCaseReportDataForCsvAction';
import { getAllCustomCaseReportDataAction } from '@web-client/presenter/actions/CaseInventoryReport/getAllCustomCaseReportDataAction';

export const exportCsvCustomCaseReportSequence = [
  getAllCustomCaseReportDataAction,
  formatCustomCaseReportDataForCsvAction,
  exportCsvFileAction,
];
