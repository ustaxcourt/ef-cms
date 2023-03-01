import {
  FORMATS,
  createISODateString,
  formatDateString,
} from '../../../business/utilities/DateHandler';

/**
 * Calculate the time to live for the provided timestamp given the `numDays` it should exist
 */
export const calculateTimeToLive = ({
  numDays = 8,
  timestamp,
}: {
  numDays: number;
  timestamp: string;
}): { expirationTimestamp: number; numSeconds: number } => {
  const numSeconds = numDays * 86400;
  const unixTimestamp = Number(
    formatDateString(timestamp, FORMATS.UNIX_TIMESTAMP_SECONDS),
  );
  const nowTimestamp = Number(
    formatDateString(createISODateString(), FORMATS.UNIX_TIMESTAMP_SECONDS),
  );
  const ttl = unixTimestamp - nowTimestamp + numSeconds;

  return {
    expirationTimestamp: unixTimestamp + numSeconds,
    numSeconds: ttl,
  };
};
