import { state } from 'cerebral';

export const batchDownloadHelper = get => {
  const batchDownloads = get(state.batchDownloads) || {
    fileCount: 3,
    totalFiles: 7,
  };

  const result = {
    addedFiles: batchDownloads.fileCount,
    percentComplete: Math.floor(
      (batchDownloads.fileCount * 100) / batchDownloads.totalFiles,
    ),
    totalFiles: batchDownloads.totalFiles,
  };
  return result;
};
