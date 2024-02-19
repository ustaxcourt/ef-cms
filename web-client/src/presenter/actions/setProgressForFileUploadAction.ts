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
  console.log('props', props);
  const { files } = props;
  const loadedAmounts: Record<string, number> = {};
  // O.K. to use Date constructor for calculating time duration
  // eslint-disable-next-line @miovision/disallow-date/no-new-date
  const startTime = formatNow();
  const totalSizes: Record<string, number> = {};

  const calculateTotalSize = () => {
    return Object.keys(loadedAmounts).reduce((acc, key) => {
      return totalSizes[key] + acc;
    }, 0);
  };
  const calculateTotalLoaded = () => {
    return Object.keys(loadedAmounts).reduce((acc, key) => {
      return loadedAmounts[key] + acc;
    }, 0);
  };

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
    loadedAmounts[key] = 0;
    return progressEvent => {
      const { isDone, isHavingSystemIssues, loaded, total } = progressEvent;
      if (total) {
        totalSizes[key] = total;
      }
      loadedAmounts[key] = isDone ? totalSizes[key] : loaded;
      const fileSize = calculateTotalSize();
      // O.K. to use Date constructor for calculating time duration
      const now = formatNow();
      const timeElapsed = dateStringsCompared(now, startTime);
      const uploadedBytes = calculateTotalLoaded();
      const uploadSpeed = uploadedBytes / (timeElapsed / 1000);
      const timeRemaining = Math.floor(
        (fileSize - uploadedBytes) / uploadSpeed,
      );
      let totalBytes = get(state.fileUploadProgress.filesTotalBytes);

      // 1. get documentsProgress of each file type from state
      const documentsUploadProgress: Record<string, number> = get(
        state.fileUploadProgress.documentsProgress,
      );

      if (!documentsUploadProgress[key]) {
        totalBytes += fileSize;
        store.set(state.fileUploadProgress.filesTotalBytes, totalBytes);
      }
      documentsUploadProgress[key] = uploadedBytes;

      // 2. update a value based on doc report received
      store.set(
        state.fileUploadProgress.documentsProgress,
        documentsUploadProgress,
      );

      // 3. calculate the average of all values in the object
      const bytesArray: number[] = Object.values(documentsUploadProgress);
      const sumOfUploadedBytes: number = bytesArray.reduce(
        (acc, curr) => acc + curr,
        0,
      );
      const avgCompletionOfAllDocuments = Math.ceil(
        (sumOfUploadedBytes / totalBytes) * 100,
      );
      // 4. update `documentUploadPercentCompleted` in state
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
