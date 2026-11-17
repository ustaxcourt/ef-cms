import { toEasternTime } from './eastern-time.helpers';

export const EASTERN_CRONS = {
  edt: '55 11 * * 1',
  est: '55 12 * * 1',
} as const;

export const shouldPostForSchedule = ({
  now,
  schedule,
}: {
  now: string;
  schedule?: string;
}): boolean => {
  if (!schedule) {
    return true;
  }
  const isDaylightTime = toEasternTime(now).isInDST;
  return schedule === (isDaylightTime ? EASTERN_CRONS.edt : EASTERN_CRONS.est);
};
