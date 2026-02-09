import {
  CloudWatchLogsClient,
  GetQueryResultsCommand,
  StartQueryCommand,
  type ResultField,
} from '@aws-sdk/client-cloudwatch-logs';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import { sleep } from '@shared/tools/helpers';

export const performQuery = async ({
  endTime,
  logGroupNames,
  region,
  queryString,
  startTime,
}: {
  endTime: number;
  logGroupNames: string[];
  region: string;
  queryString: string;
  startTime: number;
}): Promise<ResultField[][]> => {
  const cloudwatchClient = new CloudWatchLogsClient({ region });
  const startQuery = await cloudwatchClient.send(
    new StartQueryCommand({
      endTime,
      logGroupNames,
      queryString,
      startTime,
    }),
  );

  const { queryId } = startQuery;
  if (!queryId) {
    throw new Error('Failed to start CloudWatch Logs Insights query');
  }

  let status: string | undefined;
  let results: ResultField[][] = [];
  const pollIntervalMs: number = 1500;
  const maxWaitMs: number = 60000; // 1 minute
  const deadlineMs: number = getCurrentDateTimeInMillis() + maxWaitMs;

  while (getCurrentDateTimeInMillis() < deadlineMs) {
    const resp = await cloudwatchClient.send(
      new GetQueryResultsCommand({ queryId }),
    );
    // eslint-disable-next-line prefer-destructuring
    status = resp.status;
    if (status === 'Complete') {
      results = resp.results ?? [];
      break;
    }
    if (status === 'Failed' || status === 'Cancelled' || status === 'Timeout') {
      throw new Error(
        `Logs Insights query did not complete successfully: ${status}`,
      );
    }
    await sleep(pollIntervalMs);
  }

  if (status !== 'Complete') {
    throw new Error('Timed out waiting for Logs Insights query to complete');
  }

  return results;
};
