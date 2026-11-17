import { DateTime } from 'luxon';
import { USTC_TZ } from '@shared/business/utilities/DateHandler';

export const toEasternTime = (isoDateTime: string): DateTime =>
  DateTime.fromISO(isoDateTime, { zone: 'utc' }).setZone(USTC_TZ);

export const isoToMillis = (isoDateTime: string): number =>
  DateTime.fromISO(isoDateTime, { zone: 'utc' }).toMillis();
