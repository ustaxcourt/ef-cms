import { ProgressData } from '@web-api/persistence/s3/zipDocuments';

export const parseProgressFromLog = (message?: string): ProgressData | null => {
  if (!message) return null;

  try {
    if (message.includes('PROGRESS:')) {
      const jsonStr = message.substring(message.indexOf('{'));
      const json = JSON.parse(jsonStr);
      return {
        filesCompleted: json.currentFile,
        totalFiles: json.totalFiles,
      };
    }
  } catch (e) {
    throw new Error(`Error parsing progress log: ${e}`);
  }

  return null;
};
