import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the batch download progress state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get function used for getting state
 * @param {object} providers.props the cerebral props object
 */
export const updateBatchDownloadProgressAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const {
    action,
    entries,
    numberOfDocketRecordsGenerated,
    numberOfDocketRecordsToGenerate,
    numberOfFilesToBatch,
    numberOfRecordsDownloaded,
    totalFiles,
  } = props;

  let done = 0;
  const lastDone = get(state.batchDownloads.fileCount) || 0;
  const total =
    numberOfFilesToBatch + numberOfDocketRecordsToGenerate || totalFiles;

  switch (action) {
    case 'batch_download_docket_generated':
      done = numberOfDocketRecordsGenerated;
      break;
    case 'batch_download_upload_start':
      done = numberOfDocketRecordsToGenerate;
      break;
    case 'batch_download_progress':
      done = numberOfDocketRecordsToGenerate + entries.processed;
      break;
    case 'batch_download_csv_data':
      done = numberOfRecordsDownloaded;
      break;
  }

  done = Math.max(done, lastDone);
  store.set(state.batchDownloads.zipInProgress, true);
  store.set(state.batchDownloads.totalFiles, total);
  store.set(state.batchDownloads.fileCount, done);
};
