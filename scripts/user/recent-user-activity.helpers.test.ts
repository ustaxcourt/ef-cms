import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  GetQueryResultsCommand,
  type ResultField,
  StartQueryCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import {
  type ActivityRow,
  type LoginRow,
  SAMPLE_QUERY,
  buildActivityQuery,
  buildLoginsQuery,
  findApiLogGroups,
  formatInsightsTimestamp,
  getQueryWindow,
  getRecentUserActivity,
  sanitizeSampleMessage,
  toActivityRows,
  toLoginRows,
  toRecords,
} from './recent-user-activity.helpers';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { mockClient } from 'aws-sdk-client-mock';

const cloudwatchMock = mockClient(CloudWatchLogsClient);

// 2026-11-15T17:00:00.000Z (12:00 pm Eastern)
const NOW_EPOCH_SECONDS = 1794762000;
const NOW = calculateDate({ dateString: '2026-11-15T17:00:00.000Z' });

const toResultFields = (record: { [field: string]: string }): ResultField[] =>
  Object.entries(record).map(([field, value]) => ({ field, value }));

const mockLogGroups = (names: string[]): void => {
  cloudwatchMock.on(DescribeLogGroupsCommand).callsFake(input => ({
    logGroups: names
      .filter(name => name.startsWith(input.logGroupNamePrefix))
      .map(logGroupName => ({ logGroupName })),
  }));
};

/**
 * Mocks StartQuery/GetQueryResults so the Nth query started gets the Nth
 * result set.
 */
const mockQueryResults = (
  resultsInQueryOrder: { [field: string]: string }[][],
): void => {
  let startCount = 0;
  cloudwatchMock.on(StartQueryCommand).callsFake(() => ({
    queryId: `query-${startCount++}`,
  }));
  resultsInQueryOrder.forEach((results, i) => {
    cloudwatchMock
      .on(GetQueryResultsCommand, { queryId: `query-${i}` })
      .resolves({ results: results.map(toResultFields), status: 'Complete' });
  });
};

const startQueryInputs = (): {
  endTime?: number;
  logGroupNames?: string[];
  queryString?: string;
  startTime?: number;
}[] =>
  cloudwatchMock
    .commandCalls(StartQueryCommand)
    .map(call => call.args[0].input);

describe('recent-user-activity helpers', () => {
  beforeEach(() => {
    cloudwatchMock.reset();
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'], now: NOW });
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(console, 'table').mockImplementation(() => undefined);
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('buildLoginsQuery', () => {
    it('matches password and SSO logins and extracts the email from the request body', () => {
      const query = buildLoginsQuery({ staffOnly: false });

      expect(query).toContain(
        String.raw`| filter @message like /Request ended: POST \/auth\/(login|code)/`,
      );
      expect(query).toContain('| parse body /"email":"(?<loginEmail>[^"]+)"/');
      expect(query).not.toContain('ustaxcourt');
    });

    it('filters to ustaxcourt.gov emails when staffOnly is true', () => {
      expect(buildLoginsQuery({ staffOnly: true })).toContain(
        String.raw`| filter loginEmail like /(?i)ustaxcourt\.gov$/`,
      );
    });
  });

  describe('buildActivityQuery', () => {
    it('aggregates authenticated requests by user', () => {
      const query = buildActivityQuery({ staffOnly: false });

      expect(query).toContain(
        'filter @message like /Request ended:/ and ispresent(user.userId)',
      );
      expect(query).toContain(
        'by user.email as email, user.name as name, user.role as role',
      );
      expect(query).not.toContain('ustaxcourt');
    });

    it('filters to ustaxcourt.gov emails when staffOnly is true', () => {
      expect(buildActivityQuery({ staffOnly: true })).toContain(
        String.raw`| filter user.email like /(?i)ustaxcourt\.gov$/`,
      );
    });
  });

  describe('getQueryWindow', () => {
    it('returns epoch-second bounds ending now and starting the given minutes earlier', () => {
      const window = getQueryWindow({ minutes: 15 });

      expect(window.endTime).toBe(NOW_EPOCH_SECONDS);
      expect(window.startTime).toBe(NOW_EPOCH_SECONDS - 15 * 60);
      expect(window.endIso).toBe('2026-11-15T17:00:00.000Z');
      expect(window.startIso).toBe('2026-11-15T16:45:00.000Z');
    });
  });

  describe('findApiLogGroups', () => {
    it('returns only the API log groups that exist with an exact name match', async () => {
      mockLogGroups([
        '/aws/lambda/api_prod_blue-old',
        '/aws/lambda/api_prod_green',
      ]);

      const logGroups = await findApiLogGroups({
        cloudwatchClient: new CloudWatchLogsClient({ region: 'us-east-1' }),
        env: 'prod',
      });

      expect(logGroups).toEqual(['/aws/lambda/api_prod_green']);
      expect(
        cloudwatchMock
          .commandCalls(DescribeLogGroupsCommand)
          .map(call => call.args[0].input.logGroupNamePrefix),
      ).toEqual(['/aws/lambda/api_prod_blue', '/aws/lambda/api_prod_green']);
    });

    it('returns an empty array when DescribeLogGroups returns no logGroups', async () => {
      cloudwatchMock.on(DescribeLogGroupsCommand).resolves({});

      const logGroups = await findApiLogGroups({
        cloudwatchClient: new CloudWatchLogsClient({ region: 'us-east-1' }),
        env: 'prod',
      });

      expect(logGroups).toEqual([]);
    });
  });

  describe('toRecords', () => {
    it('converts result rows to records, dropping @ptr and unnamed fields', () => {
      const rows: ResultField[][] = [
        [
          { field: '@timestamp', value: '2026-11-15 16:59:00.000' },
          { field: '@ptr', value: 'pointer' },
          { field: 'email', value: undefined },
          { value: 'no field name' },
        ],
      ];

      expect(toRecords(rows)).toEqual([
        { '@timestamp': '2026-11-15 16:59:00.000', email: '' },
      ]);
    });
  });

  describe('formatInsightsTimestamp', () => {
    it('converts a UTC Logs Insights timestamp to Eastern time', () => {
      expect(formatInsightsTimestamp('2026-11-15 17:04:05.123', false)).toBe(
        '12:04 pm ET',
      );
    });

    it('includes the date when includeDate is true', () => {
      expect(formatInsightsTimestamp('2026-11-15 17:04:05.123', true)).toBe(
        '11/15/26 12:04 pm ET',
      );
    });

    it('returns an empty string for a missing value', () => {
      expect(formatInsightsTimestamp(undefined, false)).toBe('');
    });

    it('returns the original value when it cannot be parsed', () => {
      expect(formatInsightsTimestamp('not a timestamp', false)).toBe(
        'not a timestamp',
      );
    });
  });

  describe('toLoginRows', () => {
    it('labels each login by type, email, and result', () => {
      const rows = toLoginRows(
        [
          {
            '@timestamp': '2026-11-15 16:58:00.000',
            loginEmail: 'clerk@ustaxcourt.gov',
            status: '200',
            url: '/auth/login',
          },
          {
            '@timestamp': '2026-11-15 16:57:00.000',
            status: '200',
            url: '/auth/code',
          },
          {
            '@timestamp': '2026-11-15 16:56:00.000',
            status: '401',
            url: '/auth/login',
          },
          { '@timestamp': '2026-11-15 16:55:00.000' },
        ],
        false,
      );

      const expected: LoginRow[] = [
        {
          Email: 'clerk@ustaxcourt.gov',
          Result: 'ok',
          Time: '11:58 am ET',
          Type: 'password',
        },
        { Email: '-', Result: 'ok', Time: '11:57 am ET', Type: 'sso/code' },
        {
          Email: '?',
          Result: 'FAILED (401)',
          Time: '11:56 am ET',
          Type: 'password',
        },
        {
          Email: '-',
          Result: 'FAILED (?)',
          Time: '11:55 am ET',
          Type: 'sso/code',
        },
      ];
      expect(rows).toEqual(expected);
    });
  });

  describe('toActivityRows', () => {
    it('maps aggregated activity records to table rows', () => {
      const rows = toActivityRows(
        [
          {
            email: 'judge@ustaxcourt.gov',
            firstSeen: '2026-11-14 13:00:00.000',
            lastSeen: '2026-11-15 16:59:00.000',
            name: 'Judge Example',
            requests: '42',
            role: 'judge',
          },
          {},
        ],
        true,
      );

      const expected: ActivityRow[] = [
        {
          Email: 'judge@ustaxcourt.gov',
          'First Seen': '11/14/26 8:00 am ET',
          'Last Seen': '11/15/26 11:59 am ET',
          Name: 'Judge Example',
          Requests: 42,
          Role: 'judge',
        },
        {
          Email: '',
          'First Seen': '',
          'Last Seen': '',
          Name: '',
          Requests: 0,
          Role: '',
        },
      ];
      expect(rows).toEqual(expected);
    });
  });

  describe('sanitizeSampleMessage', () => {
    it('pretty-prints the JSON and removes request headers', () => {
      const message = `2026-11-15T16:59:00.000Z\tINFO\t${JSON.stringify({
        message: 'Request ended: GET /cases/101-26',
        request: {
          headers: { authorization: 'Bearer secret', cookie: 'refreshToken=x' },
          method: 'GET',
        },
      })}`;

      const sanitized = sanitizeSampleMessage(message);

      expect(JSON.parse(sanitized)).toEqual({
        message: 'Request ended: GET /cases/101-26',
        request: { method: 'GET' },
      });
      expect(sanitized).not.toContain('secret');
      expect(sanitized).not.toContain('refreshToken');
    });

    it('leaves JSON without a request object unchanged apart from formatting', () => {
      expect(JSON.parse(sanitizeSampleMessage('{"message":"hi"}'))).toEqual({
        message: 'hi',
      });
    });

    it('returns messages without JSON unchanged', () => {
      expect(sanitizeSampleMessage('START RequestId: abc')).toBe(
        'START RequestId: abc',
      );
    });

    it('returns messages with invalid JSON unchanged', () => {
      expect(sanitizeSampleMessage('oops {not json')).toBe('oops {not json');
    });
  });

  describe('getRecentUserActivity', () => {
    const logGroupNames = [
      '/aws/lambda/api_prod_blue',
      '/aws/lambda/api_prod_green',
    ];
    const baseOptions = {
      env: 'prod',
      minutes: 15,
      region: 'us-east-1',
      sample: false,
      staffOnly: false,
    };

    it('queries both API log groups and returns and prints logins and active users', async () => {
      mockLogGroups(logGroupNames);
      mockQueryResults([
        // logins query
        [
          {
            '@timestamp': '2026-11-15 16:50:00.000',
            loginEmail: 'clerk@ustaxcourt.gov',
            status: '200',
            url: '/auth/login',
          },
          {
            '@timestamp': '2026-11-15 16:49:00.000',
            loginEmail: 'clerk@ustaxcourt.gov',
            status: '401',
            url: '/auth/login',
          },
        ],
        // activity query
        [
          {
            email: 'clerk@ustaxcourt.gov',
            firstSeen: '2026-11-15 16:50:00.000',
            lastSeen: '2026-11-15 16:59:00.000',
            name: 'Clerk Example',
            requests: '7',
            role: 'docketclerk',
          },
        ],
      ]);

      const result = await getRecentUserActivity(baseOptions);

      expect(result.logins).toEqual([
        {
          Email: 'clerk@ustaxcourt.gov',
          Result: 'ok',
          Time: '11:50 am ET',
          Type: 'password',
        },
        {
          Email: 'clerk@ustaxcourt.gov',
          Result: 'FAILED (401)',
          Time: '11:49 am ET',
          Type: 'password',
        },
      ]);
      expect(result.activity).toEqual([
        {
          Email: 'clerk@ustaxcourt.gov',
          'First Seen': '11:50 am ET',
          'Last Seen': '11:59 am ET',
          Name: 'Clerk Example',
          Requests: 7,
          Role: 'docketclerk',
        },
      ]);
      expect(result.samples).toEqual([]);

      expect(startQueryInputs()).toEqual([
        {
          endTime: NOW_EPOCH_SECONDS,
          logGroupNames,
          queryString: buildLoginsQuery({ staffOnly: false }),
          startTime: NOW_EPOCH_SECONDS - 15 * 60,
        },
        {
          endTime: NOW_EPOCH_SECONDS,
          logGroupNames,
          queryString: buildActivityQuery({ staffOnly: false }),
          startTime: NOW_EPOCH_SECONDS - 15 * 60,
        },
      ]);
      expect(console.log).toHaveBeenCalledWith(
        'DAWSON prod | last 15 min (11/15/26 11:45 am ET - 12:00 pm ET) | api_prod_blue, api_prod_green\n',
      );
      expect(console.log).toHaveBeenCalledWith(
        'Logins: 2 attempts, 1 succeeded',
      );
      expect(console.log).toHaveBeenCalledWith('\nActive users: 1');
      expect(console.table).toHaveBeenNthCalledWith(1, result.logins);
      expect(console.table).toHaveBeenNthCalledWith(2, result.activity);
      expect(process.exit).not.toHaveBeenCalled();
    });

    it('uses the staff-only queries, includes dates for long windows, and prints (none) for empty results', async () => {
      mockLogGroups(logGroupNames);
      mockQueryResults([
        // logins query
        [
          {
            '@timestamp': '2026-11-14 16:50:00.000',
            loginEmail: 'clerk@ustaxcourt.gov',
            status: '200',
            url: '/auth/login',
          },
        ],
        // activity query
        [],
      ]);

      const result = await getRecentUserActivity({
        ...baseOptions,
        cloudwatchClient: new CloudWatchLogsClient({ region: 'us-east-1' }),
        minutes: 24 * 60,
        staffOnly: true,
      });

      expect(result.logins[0].Time).toBe('11/14/26 11:50 am ET');
      expect(result.activity).toEqual([]);
      expect(startQueryInputs().map(input => input.queryString)).toEqual([
        buildLoginsQuery({ staffOnly: true }),
        buildActivityQuery({ staffOnly: true }),
      ]);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('| staff only'),
      );
      expect(console.log).toHaveBeenCalledWith('  (none)');
      expect(console.table).toHaveBeenCalledTimes(1);
    });

    it('prints sanitized raw log lines and skips the summary queries in sample mode', async () => {
      mockLogGroups(['/aws/lambda/api_prod_green']);
      mockQueryResults([
        [
          {
            '@message': JSON.stringify({
              request: { headers: { authorization: 'Bearer secret' } },
            }),
            '@timestamp': '2026-11-15 16:59:00.000',
          },
          { '@timestamp': '2026-11-15 16:58:00.000' },
        ],
      ]);

      const result = await getRecentUserActivity({
        ...baseOptions,
        sample: true,
      });

      expect(result.samples).toEqual([
        JSON.stringify({ request: {} }, null, 2),
        '',
      ]);
      expect(result.logins).toEqual([]);
      expect(result.activity).toEqual([]);
      expect(startQueryInputs()).toEqual([
        expect.objectContaining({
          logGroupNames: ['/aws/lambda/api_prod_green'],
          queryString: SAMPLE_QUERY,
        }),
      ]);
      expect(console.log).toHaveBeenCalledWith(
        `2026-11-15 16:59:00.000\n${result.samples[0]}\n`,
      );
      expect(console.table).not.toHaveBeenCalled();
    });

    it('reports an error and exits when no API log groups exist', async () => {
      mockLogGroups([]);

      await getRecentUserActivity(baseOptions);

      expect(console.error).toHaveBeenCalledWith(
        'Error:',
        new Error(
          'No /aws/lambda/api_prod_<blue|green> log groups found in us-east-1.',
        ),
      );
      expect(process.exit).toHaveBeenCalledWith(1);
      expect(cloudwatchMock.commandCalls(StartQueryCommand)).toHaveLength(0);
    });

    it.each([0, -5, 1.5, NaN])(
      'reports an error and exits without calling AWS when minutes is %p',
      async minutes => {
        await getRecentUserActivity({ ...baseOptions, minutes });

        expect(console.error).toHaveBeenCalledWith(
          'Error:',
          new Error(`--minutes must be a positive integer (got ${minutes})`),
        );
        expect(process.exit).toHaveBeenCalledWith(1);
        expect(cloudwatchMock.calls()).toHaveLength(0);
      },
    );

    it('reports an error and exits when a CloudWatch call fails', async () => {
      const accessDenied = new Error('AccessDeniedException');
      cloudwatchMock.on(DescribeLogGroupsCommand).rejects(accessDenied);

      await getRecentUserActivity(baseOptions);

      expect(console.error).toHaveBeenCalledWith('Error:', accessDenied);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
