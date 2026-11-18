jest.mock('../helpers/runCommand', () => ({ runCommand: jest.fn() }));

import {
  DEFAULT_REPO,
  type SummaryEnv,
  TEAMS_TIMEOUT_MS,
  postToTeams,
  runWeeklySummary,
  securityDashboardUrl,
} from './security-weekly-summary-run.helpers';
import { runCommand } from '../helpers/runCommand';

const WEBHOOK = 'https://example.invalid/webhook?sig=fake-signature';
const NOW = '2026-11-16T12:55:00Z';
const PAYLOAD = { attachments: [], type: 'message' as const };

const fakeAlert = JSON.stringify({
  category: 'gitleaks-baseline',
  created_at: '2026-11-12T15:00:00Z',
  html_url: 'https://github.com/example/repo/security/code-scanning/31337',
  number: 31337,
  rule: {
    id: 'fake-rule-sentinel',
    security_severity_level: null,
    severity: 'error',
    tags: null,
  },
});
const okRun = JSON.stringify({
  conclusion: 'success',
  created_at: '2026-11-16T06:00:10Z',
  html_url: 'https://github.com/example/repo/actions/runs/1',
  status: 'completed',
});

const commandRunner = jest.fn((_cmd: string, args?: string[]) =>
  Promise.resolve(args?.[1].includes('code-scanning') ? fakeAlert : okRun),
);
const okFetch = () => jest.fn().mockResolvedValue({ ok: true, status: 202 });

const run = (
  env: SummaryEnv = {},
  overrides: Partial<Parameters<typeof runWeeklySummary>[0]> = {},
) => {
  const fetchFn = okFetch();
  const log = jest.fn();
  const print = jest.fn();
  const done = runWeeklySummary({
    commandRunner,
    env: {
      GITHUB_REPOSITORY: 'example/repo',
      TEAMS_WEBHOOK_URL: WEBHOOK,
      ...env,
    },
    fetchFn,
    log,
    now: NOW,
    print,
    ...overrides,
  });
  return { done, fetchFn, log, print };
};

const postedCard = (fetchFn: jest.Mock) =>
  JSON.parse(fetchFn.mock.calls[0][1].body).attachments[0].content;

describe('postToTeams', () => {
  it('posts JSON with a timeout and returns the status', async () => {
    const fetchFn = okFetch();

    await expect(
      postToTeams({ fetchFn, payload: PAYLOAD, webhookUrl: WEBHOOK }),
    ).resolves.toBe(202);
    expect(fetchFn).toHaveBeenCalledWith(WEBHOOK, {
      body: JSON.stringify(PAYLOAD),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      signal: expect.any(AbortSignal),
    });
    expect(TEAMS_TIMEOUT_MS).toBe(30_000);
  });

  it('reports a rejected post by status code only', async () => {
    const fetchFn = jest.fn().mockResolvedValue({ ok: false, status: 400 });

    await expect(
      postToTeams({ fetchFn, payload: PAYLOAD, webhookUrl: WEBHOOK }),
    ).rejects.toThrow(/^Teams webhook returned HTTP 400$/);
  });

  it('hides network error details, which can include the URL', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error(`failed: ${WEBHOOK}`));

    await expect(
      postToTeams({ fetchFn, payload: PAYLOAD, webhookUrl: WEBHOOK }),
    ).rejects.toThrow(/^Teams webhook request failed before a response$/);
  });

  it('uses the global fetch by default', async () => {
    const spy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({ ok: true, status: 202 } as Response);

    await postToTeams({ payload: PAYLOAD, webhookUrl: WEBHOOK });

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe('runWeeklySummary', () => {
  it('posts the card and logs only the status', async () => {
    const { done, fetchFn, log } = run();
    await done;

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn.mock.calls[0][0]).toBe(WEBHOOK);
    expect(postedCard(fetchFn).actions[0].url).toBe(
      securityDashboardUrl('example/repo'),
    );
    expect(log.mock.calls).toEqual([
      ['Posted the weekly security summary (HTTP 202).'],
    ]);
  });

  it('passes RUN_URL and SINCE through', async () => {
    const { done, fetchFn } = run({
      RUN_URL: 'https://run.example',
      SINCE: '2026-11-02',
    });
    await done;

    const card = postedCard(fetchFn);
    expect(card.actions.map((a: { url: string }) => a.url)).toEqual([
      securityDashboardUrl('example/repo'),
      'https://run.example',
    ]);
    expect(JSON.stringify(card.body)).toContain('since 11/02/26 7:00 AM ET');
  });

  it('falls back to the court repo and its dashboard', async () => {
    const { done, fetchFn } = run({ GITHUB_REPOSITORY: '' });
    await done;

    expect(commandRunner.mock.calls.at(-1)?.[1]?.[1]).toContain(DEFAULT_REPO);
    expect(postedCard(fetchFn).actions[0].url).toBe(
      securityDashboardUrl(DEFAULT_REPO),
    );
  });

  it('prints the payload instead of posting on a local dry run', async () => {
    const { done, fetchFn, print } = run(
      { TEAMS_WEBHOOK_URL: undefined },
      { dryRun: true },
    );
    await done;

    expect(fetchFn).not.toHaveBeenCalled();
    expect(JSON.parse(print.mock.calls[0][0]).type).toBe('message');
  });

  it.each([
    [
      'a dry run in GitHub Actions',
      { GITHUB_ACTIONS: 'true' },
      true,
      '--dry-run prints findings',
    ],
    [
      'no webhook',
      { TEAMS_WEBHOOK_URL: undefined },
      false,
      'TEAMS_WEBHOOK_URL',
    ],
    [
      'a non-https webhook',
      { TEAMS_WEBHOOK_URL: 'http://example.invalid' },
      false,
      'TEAMS_WEBHOOK_URL',
    ],
  ])(
    'refuses %s before calling GitHub or Teams',
    async (_, env, dryRun, message) => {
      commandRunner.mockClear();
      const { done, fetchFn } = run(env, { dryRun });

      await expect(done).rejects.toThrow(message);
      expect(commandRunner).not.toHaveBeenCalled();
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );

  it('uses runCommand, fetch, and console.log by default', async () => {
    (runCommand as jest.Mock).mockResolvedValue('');
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({ ok: true, status: 202 } as Response);
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await runWeeklySummary({
      env: { TEAMS_WEBHOOK_URL: WEBHOOK },
      now: NOW,
    });
    await runWeeklySummary({ dryRun: true, env: {}, now: NOW });

    expect(runCommand).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledTimes(2);
    fetchSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('never logs findings, counts or the webhook URL', async () => {
    const consoleSpies = (['log', 'info', 'warn', 'error'] as const).map(
      method => jest.spyOn(console, method).mockImplementation(() => {}),
    );
    const { done, fetchFn, log } = run();
    await done;

    const logged = JSON.stringify([
      log.mock.calls,
      ...consoleSpies.map(spy => spy.mock.calls),
    ]);
    expect(JSON.stringify(postedCard(fetchFn))).toContain('fake-rule-sentinel');
    for (const secret of [
      '31337',
      'fake-rule-sentinel',
      'sig=',
      'New findings',
    ]) {
      expect(logged).not.toContain(secret);
    }
    consoleSpies.forEach(spy => spy.mockRestore());
  });
});
