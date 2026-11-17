import {
  EASTERN_CRONS,
  shouldPostForSchedule,
} from './security-weekly-summary.helpers';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const REPO_ROOT = resolve(__dirname, '../..');
const readRepoFile = (path: string) =>
  readFileSync(resolve(REPO_ROOT, path), 'utf-8');

describe('shouldPostForSchedule', () => {
  const { edt, est } = EASTERN_CRONS;

  it.each([
    ['summer, EDT cron', '2026-07-13T11:55:00Z', edt, true],
    ['summer, EST cron', '2026-07-13T11:55:00Z', est, false],
    ['winter, EST cron', '2026-11-16T12:55:00Z', est, true],
    ['winter, EDT cron', '2026-11-16T12:55:00Z', edt, false],
    ['first Monday of EDT', '2026-03-09T11:55:00Z', edt, true],
    ['first Monday of EST', '2026-11-02T12:55:00Z', est, true],
    ['45 minutes late', '2026-11-16T13:40:00Z', est, true],
    ['a cron it does not know', '2026-11-16T12:55:00Z', '0 6 * * 1', false],
    ['a manual run', '2026-11-16T12:55:00Z', undefined, true],
    ['an empty schedule', '2026-11-16T12:55:00Z', '', true],
  ])('%s', (_, now, schedule, expected) => {
    expect(shouldPostForSchedule({ now, schedule })).toBe(expected);
  });

  it('matches the crons in security-weekly-summary.yml', () => {
    const workflow = readRepoFile(
      '.github/workflows/security-weekly-summary.yml',
    );
    const crons = [...workflow.matchAll(/cron: '([^']+)'/g)].map(m => m[1]);
    expect(crons.sort()).toEqual([edt, est].sort());
  });
});
