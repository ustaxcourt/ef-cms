import {
  CloudWatchLogsClient,
  GetQueryResultsCommand,
  StartQueryCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import { performQuery } from './perform-query';
import { sleep } from '@shared/tools/helpers';

jest.mock('@aws-sdk/client-cloudwatch-logs');
jest.mock('@shared/business/utilities/DateHandler');
jest.mock('@shared/tools/helpers');

describe('performQuery', () => {
  const mockSend = jest.fn();
  const mockRegion = 'us-east-1';
  const mockLogGroupNames = ['test-log-group'];
  const mockQueryString = 'fields @message';
  const mockStartTime = 1000;
  const mockEndTime = 2000;

  beforeEach(() => {
    (CloudWatchLogsClient as jest.Mock).mockReturnValue({
      send: mockSend,
    });
    (getCurrentDateTimeInMillis as jest.Mock).mockReturnValue(0);
    (sleep as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('performs a query and returns results when status is Complete', async () => {
    const mockQueryId = 'test-query-id';
    const mockResults = [[{ field: 'test', value: 'value' }]];

    mockSend
      .mockResolvedValueOnce({ queryId: mockQueryId }) // StartQueryCommand
      .mockResolvedValueOnce({ status: 'Complete', results: mockResults }); // GetQueryResultsCommand

    const results = await performQuery({
      endTime: mockEndTime,
      logGroupNames: mockLogGroupNames,
      queryString: mockQueryString,
      region: mockRegion,
      startTime: mockStartTime,
    });

    expect(results).toEqual(mockResults);
    expect(mockSend).toHaveBeenCalledWith(expect.any(StartQueryCommand));
    expect(mockSend).toHaveBeenCalledWith(expect.any(GetQueryResultsCommand));
  });

  it('returns an empty array if status is Complete but results are missing', async () => {
    const mockQueryId = 'test-query-id';

    mockSend
      .mockResolvedValueOnce({ queryId: mockQueryId }) // StartQueryCommand
      .mockResolvedValueOnce({ status: 'Complete', results: undefined }); // GetQueryResultsCommand

    const results = await performQuery({
      endTime: mockEndTime,
      logGroupNames: mockLogGroupNames,
      queryString: mockQueryString,
      region: mockRegion,
      startTime: mockStartTime,
    });

    expect(results).toEqual([]);
  });

  it('throws an error if queryId is not returned when starting the query', async () => {
    mockSend.mockResolvedValueOnce({ queryId: undefined });

    await expect(
      performQuery({
        endTime: mockEndTime,
        logGroupNames: mockLogGroupNames,
        queryString: mockQueryString,
        region: mockRegion,
        startTime: mockStartTime,
      }),
    ).rejects.toThrow('Failed to start CloudWatch Logs Insights query');
  });

  it('polls until status is Complete', async () => {
    const mockQueryId = 'test-query-id';
    const mockResults = [[{ field: 'test', value: 'value' }]];

    mockSend
      .mockResolvedValueOnce({ queryId: mockQueryId }) // StartQueryCommand
      .mockResolvedValueOnce({ status: 'Running' }) // GetQueryResultsCommand poll 1
      .mockResolvedValueOnce({ status: 'Complete', results: mockResults }); // GetQueryResultsCommand poll 2

    const results = await performQuery({
      endTime: mockEndTime,
      logGroupNames: mockLogGroupNames,
      queryString: mockQueryString,
      region: mockRegion,
      startTime: mockStartTime,
    });

    expect(results).toEqual(mockResults);
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(1500);
  });

  it('throws an error if the query fails, is cancelled, or times out in AWS', async () => {
    const statuses = ['Failed', 'Cancelled', 'Timeout'];

    for (const status of statuses) {
      mockSend.mockReset();
      mockSend
        .mockResolvedValueOnce({ queryId: 'test-query-id' })
        .mockResolvedValueOnce({ status });

      await expect(
        performQuery({
          endTime: mockEndTime,
          logGroupNames: mockLogGroupNames,
          queryString: mockQueryString,
          region: mockRegion,
          startTime: mockStartTime,
        }),
      ).rejects.toThrow(
        `Logs Insights query did not complete successfully: ${status}`,
      );
    }
  });

  it('throws an error if the query times out locally (by reaching deadlineMs)', async () => {
    const mockQueryId = 'test-query-id';

    mockSend
      .mockResolvedValueOnce({ queryId: mockQueryId }) // StartQueryCommand
      .mockResolvedValue({ status: 'Running' }); // Always Running

    // Mock getCurrentDateTimeInMillis to progress time
    // 1st call: deadlineMs = 0 + 60000 = 60000
    // 2nd call: 0 < 60000 (true)
    // 3rd call: 60000 < 60000 (false)
    (getCurrentDateTimeInMillis as jest.Mock)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(60000);

    await expect(
      performQuery({
        endTime: mockEndTime,
        logGroupNames: mockLogGroupNames,
        queryString: mockQueryString,
        region: mockRegion,
        startTime: mockStartTime,
      }),
    ).rejects.toThrow('Timed out waiting for Logs Insights query to complete');
  });
});
