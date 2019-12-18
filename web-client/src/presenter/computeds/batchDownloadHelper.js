import { state } from 'cerebral';

export const batchDownloadHelper = get => {
  const fileCount = get(state.batchDownloads.fileCount) || 0;
  const totalFiles = get(state.batchDownloads.totalFiles) || 0;

  const result = {
    addedFiles: fileCount,
    percentComplete: Math.floor((fileCount * 100) / totalFiles),
    totalFiles,
  };
  return result;
};
