import { state } from '@web-client/presenter/app.cerebral';

export const updateBatchDownloadProgressAction = ({
  props,
  store,
}: ActionProps<{
  totalFiles: number;
  action: string;
  filesCompleted: number;
}>) => {
  const { action, filesCompleted, totalFiles } = props;

  switch (action) {
    case 'batch_download_docket_generated':
      store.set(
        state.batchDownloads.title,
        'Generating Printable Docket Records and Docket Entries',
      );
      break;
    case 'batch_download_progress':
      store.set(state.batchDownloads.title, 'Compressing Files');
      break;
    case 'batch_download_csv_data':
      store.set(state.batchDownloads.title, 'Gathering Data');
      break;
    case 'aws_batch_download_progress':
      store.set(state.batchDownloads.title, 'Preparing Files');
      break;
  }

  store.set(state.batchDownloads.zipInProgress, true);
  store.set(state.batchDownloads.totalFiles, totalFiles);
  store.set(state.batchDownloads.fileCount, filesCompleted);
};
