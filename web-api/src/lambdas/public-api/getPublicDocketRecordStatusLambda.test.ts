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

  const VALID_JOB_ID = '11111111-2222-4333-8444-555555555555';
  const resultKeyFor = (id: string) => `public-docket-record/${id}.json`;
  const errorKeyFor = (id: string) => `public-docket-record/${id}.error`;

  const buildEvent = (jobId = VALID_JOB_ID) => ({
    body: {},
    headers: {},
    path: '',
    pathParameters: { jobId },
    queryStringParameters: {},
  });

  beforeEach(() => {
    jest
      .mocked(getMaintenanceModeMock)
      .mockResolvedValue({ current: false } as any);
  });

  it('reads the marker and returns a presigned URL for the interactor-chosen key', async () => {
    isFileExists.mockImplementation(({ key }) =>
      Promise.resolve(key === resultKeyFor(VALID_JOB_ID)),
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
      Promise.resolve(key === errorKeyFor(VALID_JOB_ID)),
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

  it('returns a structured error when the result marker is corrupted JSON so polling terminates', async () => {
    isFileExists.mockImplementation(({ key }) =>
      Promise.resolve(key === resultKeyFor(VALID_JOB_ID)),
    );
    getDocument.mockResolvedValue(Buffer.from('not-json') as any);

    const response = await getPublicDocketRecordStatusLambda(buildEvent());

    const body = JSON.parse(response.body);
    expect(body).toEqual({
      message: 'Failed to generate docket record',
      status: 'error',
      statusCode: 500,
    });
    expect(getDownloadPolicyUrl).not.toHaveBeenCalled();
  });

  it('returns a structured error when the result marker is missing fileId so polling terminates', async () => {
    isFileExists.mockImplementation(({ key }) =>
      Promise.resolve(key === resultKeyFor(VALID_JOB_ID)),
    );
    getDocument.mockResolvedValue(Buffer.from(JSON.stringify({})) as any);

    const response = await getPublicDocketRecordStatusLambda(buildEvent());

    const body = JSON.parse(response.body);
    expect(body).toEqual({
      message: 'Failed to generate docket record',
      status: 'error',
      statusCode: 500,
    });
    expect(getDownloadPolicyUrl).not.toHaveBeenCalled();
  });

  it('rejects a non-UUID jobId without touching S3 so callers cannot probe arbitrary keys', async () => {
    const response = await getPublicDocketRecordStatusLambda(
      buildEvent('job-1'),
    );

    const body = JSON.parse(response.body);
    expect(body).toEqual({
      message: 'Invalid jobId',
      status: 'error',
      statusCode: 400,
    });
    expect(isFileExists).not.toHaveBeenCalled();
    expect(getDocument).not.toHaveBeenCalled();
  });

  it('returns pending while neither marker exists', async () => {
    isFileExists.mockResolvedValue(false);

    const response = await getPublicDocketRecordStatusLambda(buildEvent());

    const body = JSON.parse(response.body);
    expect(body).toEqual({ status: 'pending' });
    expect(getDownloadPolicyUrl).not.toHaveBeenCalled();
  });
});
