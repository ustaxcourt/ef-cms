import { state } from 'cerebral';

export const fileUploadStatusHelper = get => {
  const timeRemaining = get(state.timeRemaining);
  let statusMessage;

  if (!Number.isFinite(timeRemaining)) {
    statusMessage = 'Preparing Upload';
  } else if (timeRemaining < 60) {
    statusMessage = 'Less than 1 Minute Left';
  } else if (timeRemaining < 60 * 60) {
    statusMessage = `${Math.floor(timeRemaining / 60)} Minutes Left`;
  } else {
    statusMessage = `${Math.floor(timeRemaining / 3600)} Hours ${Math.floor(
      (timeRemaining % 3600) / 60,
    )} Minutes Left`;
  }

  return {
    statusMessage,
  };
};
