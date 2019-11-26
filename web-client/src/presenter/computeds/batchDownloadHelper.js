import { state } from 'cerebral';

export const batchDownloadHelper = get => {
  const batchDownloads = get(state.batchDownloads) || {
    batchStep: 'adding',
    fileCount: 3,
    isThisMockData: 'You betcha',
    totalFiles: 7,
  };
  let statusMessage;

  switch (batchDownloads.batchStep) {
    case 'preparing':
      statusMessage = 'Gathering records';
      break;
    case 'adding':
      statusMessage = `Adding ${batchDownloads.fileCount} of ${batchDownloads.totalFiles} files`;
      break;
    case 'compressing':
      statusMessage = 'Generating ZIP file';
      break;
  }

  const result = {
    addedFiles: batchDownloads.fileCount,
    percentComplete: Math.floor(
      (batchDownloads.fileCount * 100) / batchDownloads.totalFiles,
    ),
    statusMessage,
    totalFiles: batchDownloads.totalFiles,
  };
  return result;
};
