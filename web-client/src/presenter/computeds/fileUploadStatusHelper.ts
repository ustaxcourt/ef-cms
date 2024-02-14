import { state } from '@web-client/presenter/app.cerebral';
import { throttle } from 'lodash';

const throttledStatus = throttle(statusMessage => statusMessage, 3000, {
  leading: true,
});

import { Get } from 'cerebral';
export const fileUploadStatusHelper = (get: Get): any => {
  const timeRemaining = get(state.fileUploadProgress.timeRemaining);
  const percentComplete = get(state.fileUploadProgress.percentComplete);
  const isUploading = get(state.fileUploadProgress.isUploading);
  const isHavingSystemIssues = get(
    state.fileUploadProgress.isHavingSystemIssues,
  );
  const shouldThrottle = !get(state.fileUploadProgress.noThrottle); // results WILL be throttled unless explicitly set to false

  const isCancelable = !!(
    Number.isFinite(timeRemaining) && percentComplete < 100
  );
  let statusMessage;

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
    isCancelable,
    isHavingSystemIssues,
    statusMessage: shouldThrottle
      ? throttledStatus(statusMessage)
      : statusMessage,
  };
};
