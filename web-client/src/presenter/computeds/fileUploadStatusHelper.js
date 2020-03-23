import { state } from 'cerebral';

export const fileUploadStatusHelper = get => {
  const timeRemaining = get(state.fileUploadProgress.timeRemaining);
  const percentComplete = get(state.fileUploadProgress.percentComplete);
  const isUploading = get(state.fileUploadProgress.isUploading);
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
    statusMessage,
  };
};
