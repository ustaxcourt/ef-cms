import { DateTime } from 'luxon';
import { USTC_TZ } from '@shared/business/utilities/DateHandler';

export const toEasternTime = (isoDateTime: string): DateTime<true> => {
  const easternTime = DateTime.fromISO(isoDateTime, { zone: 'utc' }).setZone(
    USTC_TZ,
  );
  if (!easternTime.isValid) {
    throw new Error(`Expected an ISO date-time (got "${isoDateTime}")`);
  }
  return easternTime;
};

export const isoToMillis = (isoDateTime: string): number =>
  DateTime.fromISO(isoDateTime, { zone: 'utc' }).toMillis();
