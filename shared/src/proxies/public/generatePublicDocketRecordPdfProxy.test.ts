jest.mock('../requests');
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generatePublicDocketRecordPdfInteractor } from './generatePublicDocketRecordPdfProxy';
import { getResponse, post } from '../requests';

describe('generatePublicDocketRecordPdfProxy', () => {
  const mockPost = post as jest.Mock;
  const mockGetResponse = getResponse as jest.Mock;

  const args = {
    docketNumber: '101-20',
    docketRecordTableSort: { sortField: 'index', sortOrder: 'asc' },
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockPost.mockResolvedValue({ jobId: 'job-1' });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('POSTs to start then polls the status endpoint until ready', async () => {
    mockGetResponse
      .mockResolvedValueOnce({ data: { status: 'pending' } })
      .mockResolvedValueOnce({
        data: { status: 'ready', url: 'https://s3/presigned' },
      });

    const promise = generatePublicDocketRecordPdfInteractor(
      applicationContext,
      args,
    );
    // advance through the sleep between polls
    await jest.advanceTimersByTimeAsync(5_000);
    await expect(promise).resolves.toEqual({ url: 'https://s3/presigned' });

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost.mock.calls[0][0].endpoint).toBe(
      '/public-api/cases/101-20/generate-docket-record',
    );
    expect(mockGetResponse.mock.calls[0][0].endpoint).toBe(
      '/public-api/cases/101-20/docket-record-status/job-1',
    );
    expect(mockGetResponse).toHaveBeenCalledTimes(2);
  });

  it('throws when the status endpoint reports an error', async () => {
    mockGetResponse.mockResolvedValueOnce({
      data: { message: 'sealed case', status: 'error' },
    });

    await expect(
      generatePublicDocketRecordPdfInteractor(applicationContext, args),
    ).rejects.toThrow('sealed case');
  });

  it('propagates the statusCode from the status endpoint error so the client can classify it (e.g. 403 sealed case)', async () => {
    mockGetResponse.mockResolvedValueOnce({
      data: {
        message: 'Unauthorized to view sealed case.',
        status: 'error',
        statusCode: 403,
      },
    });

    await expect(
      generatePublicDocketRecordPdfInteractor(applicationContext, args),
    ).rejects.toMatchObject({
      message: 'Unauthorized to view sealed case.',
      statusCode: 403,
    });
  });
});
