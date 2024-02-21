import { FileUploadProgressMapType } from '../../../../shared/src/business/entities/EntityConstants';
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
}>): {
  fileUploadProgressMap: Record<
    string,
    { file: any; uploadProgress: (progressEvent: any) => void }
  >;
} => {
  const { files } = props;
  const loadedAmounts: Record<string, number> = {};
  const startTime = formatNow();
  const sizeOfFiles: Record<string, number> = {};

  Object.keys(files).forEach(key => {
    if (!files[key]) return;
    if (Array.isArray(files[key])) {
      sizeOfFiles[key] = files[key][0].size;
      //     files[key].forEach((file, index) => {
      //       totalSizes[`${key}-${index}`] = file.size;
      //     });
    } else {
      sizeOfFiles[key] = files[key].size;
    }
  });

  const createOnUploadProgress = (key: string) => {
    loadedAmounts[key] = 0;
    return progressEvent => {
      const { isDone, isHavingSystemIssues, loaded } = progressEvent;

      loadedAmounts[key] = isDone ? sizeOfFiles[key] : loaded;
      const fileSize = sizeOfFiles[key];
      const now = formatNow();
      const timeElapsed = dateStringsCompared(now, startTime);
      const uploadedBytes = loadedAmounts[key];
      const uploadSpeed = uploadedBytes / (timeElapsed / 1000);
      const timeRemaining = Math.floor(
        (fileSize - uploadedBytes) / uploadSpeed,
      );
      const filesTotalBytes = get(state.fileUploadProgress.filesTotalBytes);

      const documentsUploadProgress: Record<string, number> = get(
        state.fileUploadProgress.documentsProgress,
      );

      if (!(key in documentsUploadProgress)) {
        store.set(
          state.fileUploadProgress.filesTotalBytes,
          filesTotalBytes + fileSize,
        );
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
      const totalBytes = get(state.fileUploadProgress.filesTotalBytes);

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

  const fileUploadProgressMap = {} as FileUploadProgressMapType;

  Object.keys(files).forEach(key => {
    if (!files[key]) return;
    const file = Array.isArray(files[key]) ? files[key][0] : files[key];
    // if (Array.isArray(files[key])) {
    //     files[key].forEach((file, index) => {
    //       const fileTypeKey = `${key}-${index}`;
    //       fileUploadProgressMap[fileTypeKey] = {
    //         file,
    //         uploadProgress: createOnUploadProgress(fileTypeKey),
    //       };
    //     });
    //   } else {
    fileUploadProgressMap[key] = {
      file,
      // file: files[key],
      uploadProgress: createOnUploadProgress(key),
    };
    // }
  });

  return { fileUploadProgressMap };
};
