jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');
jest.mock('@web-api/business/useCases/generateDocketRecordPdfInteractor');
jest.mock('@web-api/persistence/s3/saveDocumentFromLambda');

import { generateDocketRecordPdfInteractor as generateDocketRecordPdfInteractorMock } from '@web-api/business/useCases/generateDocketRecordPdfInteractor';
import { generatePublicDocketRecordPdfWorkerLambda } from './generatePublicDocketRecordPdfWorkerLambda';
import { getMaintenanceMode as getMaintenanceModeMock } from '@web-api/persistence/postgres/featureFlag/getMaintenanceMode';
import { saveDocumentFromLambda as saveDocumentFromLambdaMock } from '@web-api/persistence/s3/saveDocumentFromLambda';

describe('generatePublicDocketRecordPdfWorkerLambda', () => {
  const generateInteractor = jest.mocked(generateDocketRecordPdfInteractorMock);
  const saveDocumentFromLambda = jest.mocked(saveDocumentFromLambdaMock);

  beforeEach(() => {
    jest
      .mocked(getMaintenanceModeMock)
      .mockResolvedValue({ current: false } as any);
    generateInteractor.mockResolvedValue({
      fileId: 'random-interactor-id',
      url: 'https://example.com/file',
    });
    saveDocumentFromLambda.mockResolvedValue(undefined as any);
  });

  it('runs the interactor and writes a result marker that points at the interactor-chosen S3 key', async () => {
    await generatePublicDocketRecordPdfWorkerLambda({
      body: JSON.stringify({
        docketNumber: '101-20',
        docketRecordTableSort: { sortField: 'index', sortOrder: 'asc' },
        jobId: 'job-1',
      }),
    });

    expect(generateInteractor).toHaveBeenCalledTimes(1);
    const [, args, authorizedUser] = generateInteractor.mock.calls[0];
    expect(args.docketNumber).toBe('101-20');
    expect(args.includePartyDetail).toBe(false);
    expect(authorizedUser).toBeUndefined();

    const markerWrite = saveDocumentFromLambda.mock.calls.find(
      ([arg]) => arg.key === 'public-docket-record/job-1.json',
    );
    expect(markerWrite).toBeDefined();
    expect(markerWrite![0].useTempBucket).toBe(true);
    expect(
      JSON.parse((markerWrite![0].document as Buffer).toString()),
    ).toEqual({ fileId: 'random-interactor-id' });
  });

  it('writes an error marker to S3 when the interactor fails', async () => {
    generateInteractor.mockRejectedValue(
      Object.assign(new Error('Unauthorized to view sealed case.'), {
        statusCode: 403,
      }),
    );

    await generatePublicDocketRecordPdfWorkerLambda({
      body: JSON.stringify({
        docketNumber: '101-20',
        docketRecordTableSort: { sortField: 'index', sortOrder: 'asc' },
        jobId: 'job-1',
      }),
    });

    const errorWrite = saveDocumentFromLambda.mock.calls.find(
      ([arg]) => arg.key === 'public-docket-record/job-1.error',
    );
    expect(errorWrite).toBeDefined();
    expect(errorWrite![0].useTempBucket).toBe(true);
    const body = JSON.parse((errorWrite![0].document as Buffer).toString());
    expect(body.message).toBe('Unauthorized to view sealed case.');
    expect(body.statusCode).toBe(403);
  });
});
