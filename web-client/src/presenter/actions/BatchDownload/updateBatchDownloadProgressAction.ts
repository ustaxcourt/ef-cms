import { state } from '@web-client/presenter/app.cerebral';

export const updateBatchDownloadProgressAction = ({
  get,
  props,
  store,
}: ActionProps<{
  totalFiles: number;
  action: string;
  filesCompleted: number;
  numberOfRecordsDownloaded: number;
}>) => {
  const { action, filesCompleted, numberOfRecordsDownloaded, totalFiles } =
    props;

  let done = 0;
  const lastDone = get(state.batchDownloads.fileCount) || 0;

  switch (action) {
    case 'batch_download_docket_generated':
      store.set(
        state.batchDownloads.title,
        'Generating Printable Docket Records and Docket Entries',
      );
      done = filesCompleted;
      break;
    case 'batch_download_progress':
      store.set(state.batchDownloads.title, 'Compressing Files');
      done = filesCompleted;
      break;
    case 'batch_download_csv_data':
      done = numberOfRecordsDownloaded;
      break;
  }

  done = Math.max(done, lastDone);
  store.set(state.batchDownloads.zipInProgress, true);
  store.set(state.batchDownloads.totalFiles, totalFiles);
  store.set(state.batchDownloads.fileCount, done);
};
