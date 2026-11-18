import { DateTime } from 'luxon';
import { USTC_TZ } from '@shared/business/utilities/DateHandler';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const workflow = readFileSync(
  resolve(__dirname, '../../.github/workflows/security-weekly-summary.yml'),
  'utf-8',
);

const scheduledCrons = [...workflow.matchAll(/cron: '([^']+)'/g)].map(
  match => match[1],
);

const gateCronFor = (zoneCase: string): string | undefined =>
  workflow.match(new RegExp(`${zoneCase}\\) on_time_cron='([^']+)'`))?.[1];

const easternTimeOn = (cron: string, isoDate: string): string => {
  const [minute, hour] = cron.split(' ').map(Number);
  return DateTime.fromISO(isoDate, { zone: 'utc' })
    .set({ hour, minute })
    .setZone(USTC_TZ)
    .toFormat('ccc HH:mm');
};

describe('security-weekly-summary.yml', () => {
  it('schedules exactly the two crons the gate knows about', () => {
    expect(scheduledCrons.sort()).toEqual(
      [gateCronFor('EDT'), gateCronFor('\\*')].sort(),
    );
  });

  it.each([
    ['EDT', 'EDT', '2026-07-13'],
    ['EST', '\\*', '2026-11-16'],
  ])(
    'lets the %s run through at 7:55 Monday Eastern',
    (_, zoneCase, monday) => {
      const cron = gateCronFor(zoneCase);

      expect(cron).toBeDefined();
      expect(easternTimeOn(cron ?? '', monday)).toBe('Mon 07:55');
    },
  );

  it('only runs the summary job when the gate says to post', () => {
    expect(workflow).toContain('needs: check-schedule');
    expect(workflow).toContain(
      "if: needs.check-schedule.outputs.post == 'true'",
    );
  });
});
