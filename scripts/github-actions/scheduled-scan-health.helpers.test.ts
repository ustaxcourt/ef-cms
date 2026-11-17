jest.mock('../helpers/runCommand', () => ({ runCommand: jest.fn() }));

import {
  RUN_JQ_FILTER,
  getScheduledRunHealth,
  toScanHealth,
} from './scheduled-scan-health.helpers';
import { runCommand } from '../helpers/runCommand';

const runnerReturning = (...outputs: string[]) => {
  const runner = jest.fn();
  outputs.forEach(output => runner.mockResolvedValueOnce(output));
  return runner;
};

describe('scan health', () => {
  const now = '2026-11-16T12:55:00Z';
  const url = 'https://github.com/example/repo/actions/runs/1';
  const run = (overrides: Record<string, unknown> = {}) => ({
    conclusion: 'success',
    created_at: '2026-11-16T06:00:10Z',
    html_url: url,
    status: 'completed',
    ...overrides,
  });

  it.each([
    ['this week succeeded', run(), now, { status: 'ok', url }],
    ['failed', run({ conclusion: 'failure' }), now, { status: 'failed', url }],
    [
      'cancelled',
      run({ conclusion: 'cancelled' }),
      now,
      { status: 'failed', url },
    ],
    [
      'still running',
      run({ conclusion: null, status: 'in_progress' }),
      now,
      { status: 'in_progress', url },
    ],
    ['no run', null, now, { status: 'missing' }],
    [
      "last week's run",
      run({ created_at: '2026-11-09T06:00:10Z' }),
      now,
      { status: 'missing' },
    ],
    [
      'checked on Thursday',
      run(),
      '2026-11-19T18:00:00Z',
      { status: 'ok', url },
    ],
  ])('toScanHealth: %s', (_, input, at, expected) => {
    expect(
      toScanHealth({
        name: 'Scan',
        now: at,
        run: input as Parameters<typeof toScanHealth>[0]['run'],
      }),
    ).toEqual({ name: 'Scan', ...expected });
  });

  it('checks the latest scheduled staging run of each weekly scan', async () => {
    const runner = runnerReturning(JSON.stringify(run()), 'null');

    const health = await getScheduledRunHealth({
      commandRunner: runner,
      now,
      repo: 'example/repo',
    });

    expect(health.map(h => [h.name, h.status])).toEqual([
      ['Container scans', 'ok'],
      ['DAST scan', 'missing'],
    ]);
    expect(runner).toHaveBeenCalledWith(
      'gh',
      [
        'api',
        'repos/example/repo/actions/workflows/security-containers.yml/runs?event=schedule&branch=staging&per_page=1',
        '--jq',
        RUN_JQ_FILTER,
      ],
      { GH_PAGER: 'cat', PAGER: 'cat' },
    );
    expect(runner.mock.calls[1][1][1]).toContain('security-dast.yml');
  });

  it('reports unknown for a scan it could not check, and reads empty output as missing', async () => {
    const runner = jest
      .fn()
      .mockRejectedValueOnce(new Error('gh failed'))
      .mockResolvedValueOnce('');

    const health = await getScheduledRunHealth({
      commandRunner: runner,
      now,
      repo: 'example/repo',
    });

    expect(health.map(h => h.status)).toEqual(['unknown', 'missing']);
  });

  it('uses runCommand by default', async () => {
    (runCommand as jest.Mock).mockResolvedValue('null');

    await getScheduledRunHealth({ now, repo: 'example/repo' });

    expect(runCommand).toHaveBeenCalledTimes(2);
  });
});
