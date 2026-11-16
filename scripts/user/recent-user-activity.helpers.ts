import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  type ResultField,
} from '@aws-sdk/client-cloudwatch-logs';
import {
  FORMATS,
  calculateISODate,
  createISODateString,
  formatDateString,
  prepareDateFromString,
} from '@shared/business/utilities/DateHandler';
import { performQuery } from '../cloudwatch/perform-query';

/**
 * Recent DAWSON logins and per-user activity, read from the API lambda's
 * CloudWatch logs.
 *
 * Postgres has no login / last-seen data, and Cognito does not expose a
 * usable login history, but the API lambda (`/aws/lambda/api_<env>_<color>`)
 * logs a JSON "Request ended: <METHOD> <URL>" line for every request (see
 * web-api/src/logger.ts). Authenticated requests also carry
 * `user.{userId,email,name,role}`, added by genericHandler.
 *
 * Logins are `POST /auth/login` (email/password; the email is in the
 * request body) and `POST /auth/code` (SSO code exchange; no identity is
 * logged, so these have no email).
 */

const API_COLORS = ['blue', 'green'] as const;
const STAFF_EMAIL_PATTERN = String.raw`/(?i)@ustaxcourt\.gov$/`;
const LONG_WINDOW_MINUTES = 12 * 60;
export const QUERY_LIMIT = 1000;

export type InsightsRecord = { [field: string]: string };

export type LoginRow = {
  Email: string;
  Result: string;
  Time: string;
  Type: 'password' | 'sso/code';
};

export type ActivityRow = {
  Email: string;
  'First Seen': string;
  'Last Seen': string;
  Name: string;
  Requests: number;
  Role: string;
};

export type RecentUserActivity = {
  activity: ActivityRow[];
  logins: LoginRow[];
  samples: string[];
};

type RecentUserActivityOptions = {
  env: string;
  minutes: number;
  region: string;
  sample: boolean;
  staffOnly: boolean;
  cloudwatchClient?: CloudWatchLogsClient;
};

type QueryWindow = {
  endIso: string;
  endTime: number;
  startIso: string;
  startTime: number;
};

export const buildLoginsQuery = ({
  staffOnly,
}: {
  staffOnly: boolean;
}): string =>
  [
    'fields @timestamp, request.url as url, response.statusCode as status, request.body as body',
    String.raw`| filter @message like /Request ended: POST \/auth\/(login|code)/`,
    '| parse body /"email":"(?<loginEmail>[^"]+)"/',
    ...(staffOnly ? [`| filter loginEmail like ${STAFF_EMAIL_PATTERN}`] : []),
    '| sort @timestamp desc',
    `| limit ${QUERY_LIMIT}`,
  ].join('\n');

export const buildActivityQuery = ({
  staffOnly,
}: {
  staffOnly: boolean;
}): string =>
  [
    'filter @message like /Request ended:/ and ispresent(user.userId)',
    ...(staffOnly ? [`| filter user.email like ${STAFF_EMAIL_PATTERN}`] : []),
    '| stats count(*) as requests, min(@timestamp) as firstSeen, max(@timestamp) as lastSeen' +
      ' by user.email as email, user.name as name, user.role as role',
    '| sort lastSeen desc',
    `| limit ${QUERY_LIMIT}`,
  ].join('\n');

export const SAMPLE_QUERY: string = [
  'fields @timestamp, @message',
  '| filter @message like /Request ended:/',
  '| sort @timestamp desc',
  '| limit 3',
].join('\n');

export const getQueryWindow = ({
  minutes,
}: {
  minutes: number;
}): QueryWindow => {
  const endIso = createISODateString();
  const startIso = calculateISODate({
    dateString: endIso,
    howMuch: -minutes,
    units: 'minutes',
  });
  const toEpochSeconds = (iso: string): number =>
    Number(formatDateString(iso, FORMATS.UNIX_TIMESTAMP_SECONDS));

  return {
    endIso,
    endTime: toEpochSeconds(endIso),
    startIso,
    startTime: toEpochSeconds(startIso),
  };
};

export const findApiLogGroups = async ({
  cloudwatchClient,
  env,
}: {
  cloudwatchClient: CloudWatchLogsClient;
  env: string;
}): Promise<string[]> => {
  const logGroupNames: string[] = [];
  for (const color of API_COLORS) {
    const name = `/aws/lambda/api_${env}_${color}`;
    const response = await cloudwatchClient.send(
      new DescribeLogGroupsCommand({ logGroupNamePrefix: name }),
    );
    if (response.logGroups?.some(group => group.logGroupName === name)) {
      logGroupNames.push(name);
    }
  }
  return logGroupNames;
};

export const toRecords = (rows: ResultField[][]): InsightsRecord[] =>
  rows.map(row => {
    const record: InsightsRecord = {};
    for (const { field, value } of row) {
      if (field && !field.startsWith('@ptr')) {
        record[field] = value ?? '';
      }
    }
    return record;
  });

/**
 * Logs Insights returns timestamps like "2026-11-13 18:04:05.123" in UTC.
 * Returns them in Eastern time, or the original value if it can't be parsed.
 */
export const formatInsightsTimestamp = (
  value: string | undefined,
  includeDate: boolean,
): string => {
  if (!value) return '';
  const iso = `${value.replace(' ', 'T')}Z`;
  if (!prepareDateFromString(iso, FORMATS.ISO).isValid) return value;
  return formatDateString(
    iso,
    includeDate ? FORMATS.DATE_TIME_TZ : FORMATS.TIME_TZ,
  );
};

export const toLoginRows = (
  records: InsightsRecord[],
  includeDate: boolean,
): LoginRow[] =>
  records.map(record => {
    const type = record.url?.startsWith('/auth/login')
      ? 'password'
      : 'sso/code';
    const fallbackEmail = type === 'sso/code' ? '-' : '?';
    return {
      Email: record.loginEmail || fallbackEmail,
      Result:
        record.status === '200' ? 'ok' : `FAILED (${record.status || '?'})`,
      Time: formatInsightsTimestamp(record['@timestamp'], includeDate),
      Type: type,
    };
  });

export const toActivityRows = (
  records: InsightsRecord[],
  includeDate: boolean,
): ActivityRow[] =>
  records.map(record => ({
    Email: record.email ?? '',
    'First Seen': formatInsightsTimestamp(record.firstSeen, includeDate),
    'Last Seen': formatInsightsTimestamp(record.lastSeen, includeDate),
    Name: record.name ?? '',
    Requests: Number(record.requests ?? 0),
    Role: record.role ?? '',
  }));

const isObject = (value: unknown): value is { [key: string]: unknown } =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Pretty-prints a raw log line, dropping `request.headers` (they include the
 * refresh token cookie and the bearer token).
 */
export const sanitizeSampleMessage = (message: string): string => {
  const jsonStart = message.indexOf('{');
  if (jsonStart === -1) return message;
  try {
    const parsed: unknown = JSON.parse(message.slice(jsonStart));
    if (isObject(parsed) && isObject(parsed.request)) {
      delete parsed.request.headers;
    }
    return JSON.stringify(parsed, null, 2);
  } catch {
    return message;
  }
};

/**
 * The summary queries return at most QUERY_LIMIT rows, so a full result set
 * means the counts may not cover the whole window.
 */
export const capNote = (count: number): string =>
  count >= QUERY_LIMIT
    ? ` (capped at the most recent ${QUERY_LIMIT}; use a shorter --minutes for complete counts)`
    : '';

const printRows = (rows: LoginRow[] | ActivityRow[]): void => {
  if (rows.length === 0) {
    console.log('  (none)');
    return;
  }
  console.table(rows);
};

export const getRecentUserActivity = async ({
  cloudwatchClient,
  env,
  minutes,
  region,
  sample,
  staffOnly,
}: RecentUserActivityOptions): Promise<RecentUserActivity> => {
  const result: RecentUserActivity = { activity: [], logins: [], samples: [] };
  try {
    if (!Number.isInteger(minutes) || minutes <= 0) {
      throw new Error(`--minutes must be a positive integer (got ${minutes})`);
    }

    const client = cloudwatchClient ?? new CloudWatchLogsClient({ region });
    const logGroupNames = await findApiLogGroups({
      cloudwatchClient: client,
      env,
    });
    if (logGroupNames.length === 0) {
      throw new Error(
        `No /aws/lambda/api_${env}_<blue|green> log groups found in ${region}.`,
      );
    }

    const { endIso, endTime, startIso, startTime } = getQueryWindow({
      minutes,
    });
    const includeDate = minutes > LONG_WINDOW_MINUTES;
    const runQuery = async (queryString: string): Promise<InsightsRecord[]> =>
      toRecords(
        await performQuery({
          endTime,
          logGroupNames,
          queryString,
          region,
          startTime,
        }),
      );

    console.log(
      `DAWSON ${env} | last ${minutes} min ` +
        `(${formatDateString(startIso, FORMATS.DATE_TIME_TZ)} - ${formatDateString(endIso, FORMATS.TIME_TZ)}) | ` +
        `${logGroupNames.map(name => name.split('/').pop()).join(', ')}` +
        `${staffOnly ? ' | staff only' : ''}\n`,
    );

    if (sample) {
      const records = await runQuery(SAMPLE_QUERY);
      result.samples = records.map(record =>
        sanitizeSampleMessage(record['@message'] ?? ''),
      );
      records.forEach((record, i) => {
        console.log(`${record['@timestamp']}\n${result.samples[i]}\n`);
      });
      return result;
    }

    result.logins = toLoginRows(
      await runQuery(buildLoginsQuery({ staffOnly })),
      includeDate,
    );
    const succeeded = result.logins.filter(row => row.Result === 'ok').length;
    console.log(
      `Logins: ${result.logins.length} attempts, ${succeeded} succeeded` +
        capNote(result.logins.length),
    );
    printRows(result.logins);

    result.activity = toActivityRows(
      await runQuery(buildActivityQuery({ staffOnly })),
      includeDate,
    );
    console.log(
      `\nActive users: ${result.activity.length}${capNote(result.activity.length)}`,
    );
    printRows(result.activity);

    return result;
  } catch (error: unknown) {
    console.error('Error:', error);
    process.exit(1);
  }
};
