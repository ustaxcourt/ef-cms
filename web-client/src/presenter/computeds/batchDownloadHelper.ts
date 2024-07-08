import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const batchDownloadHelper = (
  get: Get,
): {
  percentComplete: number;
  progressDescription: string;
} => {
  const fileCount = get(state.batchDownloads.fileCount) || 0;
  const totalFiles = get(state.batchDownloads.totalFiles) || 0;
  const progressDescription =
    get(state.batchDownloads.title) || 'Compressing Files';

  const percentComplete = Math.floor((fileCount * 100) / totalFiles) || 0;

  return {
    percentComplete,
    progressDescription,
  };
};
