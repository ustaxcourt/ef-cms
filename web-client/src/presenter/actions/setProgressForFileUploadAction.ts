import { FileUploadProgressMapType } from '../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setProgressForFileUploadAction = ({
  props,
  store,
}: ActionProps<{
  files: {
    size: string;
    name: string;
  };
}>): {
  fileUploadProgressMap: FileUploadProgressMapType;
} => {
  const { files } = props;
  const loadedAmounts: Record<string, number> = {};
  const startTime = new Date();
  const sizeOfFiles: Record<string, number> = {};

  const calculateTotalSize = () => {
    return Object.keys(loadedAmounts).reduce((acc, key) => {
      return sizeOfFiles[key] + acc;
    }, 0);
  };
  const calculateTotalLoaded = () => {
    return Object.keys(loadedAmounts).reduce((acc, key) => {
      return loadedAmounts[key] + acc;
    }, 0);
  };

  Object.keys(files).forEach(key => {
    if (!files[key]) return;
    sizeOfFiles[key] = files[key].size;
  });

  const createOnUploadProgress = (key: string) => {
    loadedAmounts[key] = 0;
    return progressEvent => {
      const { isDone, isHavingSystemIssues, loaded, total } = progressEvent;
      if (total) {
        sizeOfFiles[key] = total;
      }

      loadedAmounts[key] = isDone ? sizeOfFiles[key] : loaded;
      const totalSize = calculateTotalSize();
      // O.K. to use Date constructor for calculating time duration
      // eslint-disable-next-line @miovision/disallow-date/no-new-date
      const timeElapsed = new Date() - startTime;
      const uploadedBytes = calculateTotalLoaded();
      const uploadSpeed = uploadedBytes / (timeElapsed / 1000);
      const timeRemaining = Math.floor(
        (totalSize - uploadedBytes) / uploadSpeed,
      );
      const percent = Math.floor((uploadedBytes / totalSize) * 100);
      store.set(state.fileUploadProgress.percentComplete, percent);
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
    fileUploadProgressMap[key] = {
      file: files[key],
      uploadProgress: createOnUploadProgress(key),
    };
  });

  return { fileUploadProgressMap };
};
