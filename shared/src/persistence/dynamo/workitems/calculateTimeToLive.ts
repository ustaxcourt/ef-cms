import {
  createISODateString,
  dateStringsCompared,
  subtractISODates,
} from '../../../business/utilities/DateHandler';

/**
 * Calculate the 8 days from the provided timestamp
 *
 * @returns {Number} Number of seconds since the epoch forFORMATS when we want this record to expire
 */
export const calculateTimeToLive = (timestamp: string) => {
  const eightDaysAgo = subtractISODates(createISODateString(), {
    day: 8,
  });
  return Math.floor(dateStringsCompared(timestamp, eightDaysAgo) / 1000);
};
