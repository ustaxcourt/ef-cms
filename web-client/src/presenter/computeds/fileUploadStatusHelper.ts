import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { throttle } from 'lodash';

export type FileUploadStatusHelperType = {
  isHavingSystemIssues: boolean;
  statusMessage: string;
};

export const createFileUploadStatusHelper = (): ((
  get: Get,
) => FileUploadStatusHelperType) => {
  const throttledStatus = throttle(
    (statusMessage: string): string => {
      return statusMessage;
    },
    3000,
    {
      leading: true,
    },
  );

  return (get: Get): FileUploadStatusHelperType => {
    const timeRemaining = get(state.fileUploadProgress.timeRemaining);
    const percentComplete = get(state.fileUploadProgress.percentComplete);
    const isUploading = get(state.fileUploadProgress.isUploading);
    const isHavingSystemIssues = get(
      state.fileUploadProgress.isHavingSystemIssues,
    );
    const shouldThrottle = !get(state.fileUploadProgress.noThrottle);

    let statusMessage: string;

    if (percentComplete === 100) {
      statusMessage = 'Just Finishing Up';
    } else if (!Number.isFinite(timeRemaining)) {
      statusMessage = 'Preparing Upload';
    } else if (timeRemaining < 60) {
      statusMessage = 'Less Than 1 Minute Left';
    } else if (timeRemaining < 60 * 60) {
      statusMessage = `${Math.floor(timeRemaining / 60)} Minutes Left`;
    } else {
      statusMessage = `${Math.floor(timeRemaining / 3600)} Hours ${Math.floor(
        (timeRemaining % 3600) / 60,
      )} Minutes Left`;
    }

    if (!isUploading) {
      statusMessage = 'All Done!';
    }

    return {
      isHavingSystemIssues,
      statusMessage: shouldThrottle
        ? throttledStatus(statusMessage)
        : statusMessage,
    };
  };
};

export const fileUploadStatusHelper = createFileUploadStatusHelper();
