import {
  FORMATS,
  calculateDifferenceInDays,
  formatDateString,
  formatNow,
} from '@shared/business/utilities/DateHandler';

export const calculateDaysElapsedSinceLastStatusChange = (
  statusDate: string,
): { daysElapsedSinceLastStatusChange: number; statusDate: string } => {
  if (!statusDate) {
    return { daysElapsedSinceLastStatusChange: 0, statusDate: '' };
  }

  const currentDateInIsoFormat: string = formatNow();

  return {
    daysElapsedSinceLastStatusChange: calculateDifferenceInDays(
      currentDateInIsoFormat,
      statusDate,
    ),
    statusDate: formatDateString(statusDate, FORMATS.MMDDYY),
  };
};
