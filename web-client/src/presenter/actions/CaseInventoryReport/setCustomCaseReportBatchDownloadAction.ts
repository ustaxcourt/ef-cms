import { state } from '@web-client/presenter/app.cerebral';

export const setCustomCaseReportBatchDownloadAction = ({ store }) => {
  store.set(state.batchDownloads.zipInProgress, true);
  store.set(state.batchDownloads.title, 'Gathering Data');
};
