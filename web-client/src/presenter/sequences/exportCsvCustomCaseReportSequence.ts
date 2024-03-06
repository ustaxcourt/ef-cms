import { exportCsvFileAction } from '@web-client/presenter/actions/CaseInventoryReport/exportCsvFileAction';
import { formatCustomCaseReportDataForCsvAction } from '@web-client/presenter/actions/CaseInventoryReport/formatCustomCaseReportDataForCsvAction';
import { getAllCustomCaseReportDataAction } from '@web-client/presenter/actions/CaseInventoryReport/getAllCustomCaseReportDataAction';
import { setCustomCaseReportBatchDownloadAction } from '@web-client/presenter/actions/CaseInventoryReport/setCustomCaseReportBatchDownloadAction';
import { unsetBatchDownloadsAction } from '@web-client/presenter/actions/unsetBatchDownloadsAction';

export const exportCsvCustomCaseReportSequence = [
  setCustomCaseReportBatchDownloadAction,
  getAllCustomCaseReportDataAction,
  formatCustomCaseReportDataForCsvAction,
  exportCsvFileAction,
  unsetBatchDownloadsAction,
];
