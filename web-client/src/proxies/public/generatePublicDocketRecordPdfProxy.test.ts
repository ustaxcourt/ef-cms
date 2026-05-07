import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { generatePublicDocketRecordPdfInteractor } from './generatePublicDocketRecordPdfProxy';
import { get, post } from '../requests';

jest.mock('../requests');

jest.mock('@shared/tools/helpers', () => ({
  sleep: jest.fn(() => Promise.resolve()),
}));

describe('generatePublicDocketRecordPdfInteractor', () => {
  const applicationContext = {} as unknown as ClientPublicApplicationContext;

  const mockedPost = jest.mocked(post);
  const mockedGet = jest.mocked(get);

  beforeEach(() => {
    jest.resetAllMocks();
    mockedPost.mockResolvedValue({
      jobId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    });
  });

  it('returns URL immediately when the API responds synchronously (e.g. staging)', async () => {
    mockedPost.mockResolvedValue({ url: 'http://pdf.example/sync' });

    const result = await generatePublicDocketRecordPdfInteractor(
      applicationContext,
      {
        docketNumber: '101-78',
        docketRecordTableSort: {
          sortField: 'date',
          sortOrder: 'asc',
        },
      },
    );

    expect(result).toEqual({ url: 'http://pdf.example/sync' });
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it('starts the job then polls status until URL is ready', async () => {
    mockedGet
      .mockResolvedValueOnce({ status: 'pending' })
      .mockResolvedValueOnce({
        status: 'ready',
        url: 'http://pdf.example/foo',
      });

    const result = await generatePublicDocketRecordPdfInteractor(
      applicationContext,
      {
        docketNumber: '101-78',
        docketRecordTableSort: {
          sortField: 'date',
          sortOrder: 'asc',
        },
      },
    );

    expect(result).toEqual({ url: 'http://pdf.example/foo' });
    expect(mockedPost).toHaveBeenCalledTimes(1);
    expect(mockedGet).toHaveBeenCalledTimes(2);
    expect(mockedGet).toHaveBeenLastCalledWith({
      applicationContext,
      endpoint:
        '/public-api/docket-record-status/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee?pollAttempt=2',
    });
  });

  it('throws when start response lacks both url and jobId', async () => {
    mockedPost.mockResolvedValue({});

    await expect(
      generatePublicDocketRecordPdfInteractor(applicationContext, {
        docketNumber: '101-78',
        docketRecordTableSort: { sortField: 'date', sortOrder: 'asc' },
      }),
    ).rejects.toThrow(
      'Unexpected response from public docket record PDF: missing jobId and url.',
    );
  });

  it('throws when polling reports an error', async () => {
    mockedGet.mockResolvedValue({
      status: 'error',
      message: 'No PDF today',
    });

    await expect(
      generatePublicDocketRecordPdfInteractor(applicationContext, {
        docketNumber: '101-78',
        docketRecordTableSort: { sortField: 'date', sortOrder: 'asc' },
      }),
    ).rejects.toMatchObject({
      message: 'No PDF today',
      statusCode: 500,
    });
  });

  it('includes statusCode from polling errors (e.g. sealed case 403)', async () => {
    mockedGet.mockResolvedValue({
      status: 'error',
      message: 'Unauthorized to view sealed case.',
      statusCode: 403,
    });

    await expect(
      generatePublicDocketRecordPdfInteractor(applicationContext, {
        docketNumber: '101-78',
        docketRecordTableSort: { sortField: 'date', sortOrder: 'asc' },
      }),
    ).rejects.toMatchObject({
      message: 'Unauthorized to view sealed case.',
      statusCode: 403,
    });
  });
});
