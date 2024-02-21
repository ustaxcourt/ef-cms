import {
  dateStringsCompared,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const setProgressForFileUploadAction = ({
  get,
  props,
  store,
}: ActionProps<{
  files: any;
}>): Record<
  string,
  { file: any; uploadProgress: (progressEvent: any) => void }
> => {
  const { files } = props;
  const loadedAmounts: Record<string, number> = {};
  const startTime = formatNow();
  const totalSizes: Record<string, number> = {};

  Object.keys(files).forEach(key => {
    if (!files[key]) return;
    if (Array.isArray(files[key])) {
      files[key].forEach((file, index) => {
        totalSizes[`${key}-${index}`] = file.size;
      });
    } else {
      totalSizes[key] = files[key].size;
    }
  });

  const createOnUploadProgress = (key: string) => {
    loadedAmounts[key] = 0; // do we need this?
    return progressEvent => {
      const { isDone, isHavingSystemIssues, loaded, total } = progressEvent;
      if (total) {
        totalSizes[key] = total;
      }
      loadedAmounts[key] = isDone ? totalSizes[key] : loaded;
      const fileSize = totalSizes[key];
      const now = formatNow();
      const timeElapsed = dateStringsCompared(now, startTime);
      const uploadedBytes = loadedAmounts[key];
      const uploadSpeed = uploadedBytes / (timeElapsed / 1000);
      const timeRemaining = Math.floor(
        // goes somewhere else
        (fileSize - uploadedBytes) / uploadSpeed,
      );
      let totalBytes = get(state.fileUploadProgress.filesTotalBytes);

      const documentsUploadProgress: Record<string, number> = get(
        state.fileUploadProgress.documentsProgress,
      );

      if (!(key in documentsUploadProgress)) {
        totalBytes += fileSize;
        store.set(state.fileUploadProgress.filesTotalBytes, totalBytes);
      }
      documentsUploadProgress[key] = uploadedBytes;

      store.set(
        state.fileUploadProgress.documentsProgress,
        documentsUploadProgress,
      );

      const bytesArray: number[] = Object.values(documentsUploadProgress);
      const sumOfUploadedBytes: number = bytesArray.reduce(
        (acc, curr) => acc + curr,
        0,
      );
      const avgCompletionOfAllDocuments = Math.floor(
        (sumOfUploadedBytes / totalBytes) * 100,
      );

      store.set(
        state.fileUploadProgress.percentComplete,
        avgCompletionOfAllDocuments,
      );
      store.set(state.fileUploadProgress.timeRemaining, timeRemaining);
      store.set(
        state.fileUploadProgress.isHavingSystemIssues,
        isHavingSystemIssues,
      );
    };
  };

  store.set(state.fileUploadProgress.percentComplete, 0);
  store.set(state.fileUploadProgress.timeRemaining, Number.POSITIVE_INFINITY);
  store.set(state.fileUploadProgress.isUploading, true);

  const uploadProgressCallbackMap = {} as Record<
    string,
    { file: any; uploadProgress: (progressEvent: any) => void }
  >;

  Object.keys(files).forEach(key => {
    if (!files[key]) return;
    if (Array.isArray(files[key])) {
      files[key].forEach((file, index) => {
        const fileTypeKey = `${key}-${index}`;
        uploadProgressCallbackMap[fileTypeKey] = {
          file,
          uploadProgress: createOnUploadProgress(fileTypeKey),
        };
      });
    } else {
      uploadProgressCallbackMap[key] = {
        file: files[key],
        uploadProgress: createOnUploadProgress(key),
      };
    }
  });

  return { uploadProgressCallbackMap };
};
