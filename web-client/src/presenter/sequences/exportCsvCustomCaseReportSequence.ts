import { createCsvCustomCaseReportFileAction } from '@web-client/presenter/actions/CaseInventoryReport/createCsvCustomCaseReportFileAction';
import { setCustomCaseReportBatchDownloadAction } from '@web-client/presenter/actions/CaseInventoryReport/setCustomCaseReportBatchDownloadAction';

export const exportCsvCustomCaseReportSequence = [
  setCustomCaseReportBatchDownloadAction,
  createCsvCustomCaseReportFileAction,
];
