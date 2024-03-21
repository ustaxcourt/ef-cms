import { downloadCsvFileAction } from '@web-client/presenter/actions/CsvFiles/downloadCsvFileAction';
import { exportCsvFileAction } from '@web-client/presenter/actions/CaseInventoryReport/exportCsvFileAction';
import { unsetBatchDownloadsAction } from '@web-client/presenter/actions/unsetBatchDownloadsAction';

export const downloadCsvFileSequence = [
  unsetBatchDownloadsAction,
  downloadCsvFileAction,
  exportCsvFileAction,
];
