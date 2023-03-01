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
export const calculateTimeToLive = ({
  numDays = 8,
  timestamp,
}: {
  numDays: number;
  timestamp: string;
}) => {
  const numDaysAgo = subtractISODates(createISODateString(), {
    day: numDays,
  });
  return Math.floor(dateStringsCompared(timestamp, numDaysAgo) / 1000);
};
