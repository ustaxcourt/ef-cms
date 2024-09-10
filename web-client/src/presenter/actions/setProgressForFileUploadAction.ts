import { FileUploadProgressValueType } from '../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setProgressForFileUploadAction = ({
  props,
  store,
}: ActionProps<{
  files:
    | {
        size: number;
        name: string;
      }
    | {
        size: number;
        name: string;
      }[];
}>): {
  fileUploadProgressMap: Record<string, FileUploadProgressValueType>;
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

    if (Array.isArray(files[key])) {
      (files[key] as { size: number; name: string }[]).forEach(
        (file, index) => {
          const uniqueKey = `${key}-${index}`;
          sizeOfFiles[uniqueKey] = file.size;
          loadedAmounts[uniqueKey] = 0;
        },
      );
    } else {
      sizeOfFiles[key] = (files[key] as { size: number; name: string }).size;
      loadedAmounts[key] = 0;
    }
  });

  const createOnUploadProgress = (key: string) => {
    return progressEvent => {
      const { isDone, isHavingSystemIssues, loaded, total } = progressEvent;
      if (total) {
        sizeOfFiles[key] = total;
      }

      loadedAmounts[key] = isDone ? sizeOfFiles[key] : loaded;
      const totalSize = calculateTotalSize();
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

  const fileUploadProgressMap = {} as Record<
    string,
    FileUploadProgressValueType
  >;

  Object.keys(files).forEach(key => {
    if (!files[key]) return;

    if (Array.isArray(files[key])) {
      const uploadMaps = (files[key] as { size: number; name: string }[]).map(
        (file, index) => {
          const uniqueKey = `${key}-${index}`;
          return {
            file,
            uploadProgress: createOnUploadProgress(uniqueKey),
          };
        },
      );

      fileUploadProgressMap[key] = uploadMaps;
    } else {
      fileUploadProgressMap[key] = {
        file: files[key] as { size: number; name: string },
        uploadProgress: createOnUploadProgress(key),
      };
    }
  });

  return { fileUploadProgressMap };
};
