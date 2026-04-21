jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');
jest.mock('@web-api/persistence/s3/isFileExists');
jest.mock('@web-api/persistence/s3/getDownloadPolicyUrl');
jest.mock('@web-api/persistence/s3/getDocument');

import { getDocument as getDocumentMock } from '@web-api/persistence/s3/getDocument';
import { getDownloadPolicyUrl as getDownloadPolicyUrlMock } from '@web-api/persistence/s3/getDownloadPolicyUrl';
import { getMaintenanceMode as getMaintenanceModeMock } from '@web-api/persistence/postgres/featureFlag/getMaintenanceMode';
import { getPublicDocketRecordStatusLambda } from './getPublicDocketRecordStatusLambda';
import { isFileExists as isFileExistsMock } from '@web-api/persistence/s3/isFileExists';

describe('getPublicDocketRecordStatusLambda', () => {
  const isFileExists = jest.mocked(isFileExistsMock);
  const getDownloadPolicyUrl = jest.mocked(getDownloadPolicyUrlMock);
  const getDocument = jest.mocked(getDocumentMock);

  const buildEvent = () => ({
    body: {},
    headers: {},
    path: '',
    pathParameters: { docketNumber: '101-20', jobId: 'job-1' },
    queryStringParameters: {},
  });

  beforeEach(() => {
    jest
      .mocked(getMaintenanceModeMock)
      .mockResolvedValue({ current: false } as any);
  });

  it('reads the marker and returns a presigned URL for the interactor-chosen key', async () => {
    isFileExists.mockImplementation(({ key }) =>
      Promise.resolve(key === 'public-docket-record/job-1.json'),
    );
    getDocument.mockResolvedValue(
      Buffer.from(JSON.stringify({ fileId: 'random-interactor-id' })) as any,
    );
    getDownloadPolicyUrl.mockResolvedValue({
      url: 'https://s3/presigned',
    } as any);

    const response = await getPublicDocketRecordStatusLambda(buildEvent());

    const body = JSON.parse(response.body);
    expect(body).toEqual({ status: 'ready', url: 'https://s3/presigned' });
    expect(getDownloadPolicyUrl).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'random-interactor-id', useTempBucket: true }),
    );
  });

  it('returns the error message when the worker wrote an error marker', async () => {
    isFileExists.mockImplementation(({ key }) =>
      Promise.resolve(key === 'public-docket-record/job-1.error'),
    );
    getDocument.mockResolvedValue(
      Buffer.from(
        JSON.stringify({ message: 'boom', statusCode: 403 }),
      ) as any,
    );

    const response = await getPublicDocketRecordStatusLambda(buildEvent());

    const body = JSON.parse(response.body);
    expect(body).toEqual({
      message: 'boom',
      status: 'error',
      statusCode: 403,
    });
  });

  it('falls back to a default message when the error marker is not valid JSON', async () => {
    isFileExists.mockImplementation(({ key }) =>
      Promise.resolve(key.endsWith('.error')),
    );
    getDocument.mockResolvedValue(Buffer.from('not-json') as any);

    const response = await getPublicDocketRecordStatusLambda(buildEvent());

    const body = JSON.parse(response.body);
    expect(body.status).toBe('error');
    expect(body.message).toBe('Failed to generate docket record');
    expect(body.statusCode).toBe(500);
  });

  it('returns pending while neither marker exists', async () => {
    isFileExists.mockResolvedValue(false);

    const response = await getPublicDocketRecordStatusLambda(buildEvent());

    const body = JSON.parse(response.body);
    expect(body).toEqual({ status: 'pending' });
    expect(getDownloadPolicyUrl).not.toHaveBeenCalled();
  });
});
