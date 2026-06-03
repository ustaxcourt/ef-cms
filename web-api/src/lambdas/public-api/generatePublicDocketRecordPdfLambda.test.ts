jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');

const mockLambdaClientSend = jest.fn();
jest.mock('@web-api/gateways/lambda/getLambdaClient', () => ({
  getLambdaClient: () => ({ send: mockLambdaClientSend }),
}));

const mockWorkerHandler = jest.fn();
jest.mock('./generatePublicDocketRecordPdfWorkerLambda', () => ({
  generatePublicDocketRecordPdfWorkerLambda: (...args: unknown[]) =>
    mockWorkerHandler(...args),
  PUBLIC_DOCKET_RECORD_S3_PREFIX: 'public-docket-record/',
  resultKey: (jobId: string) => `public-docket-record/${jobId}.json`,
  errorKey: (jobId: string) => `public-docket-record/${jobId}.error`,
}));

import { environment } from '@web-api/environment';
import { generatePublicDocketRecordPdfLambda } from './generatePublicDocketRecordPdfLambda';
import { getMaintenanceMode as getMaintenanceModeMock } from '@web-api/persistence/postgres/featureFlag/getMaintenanceMode';

describe('generatePublicDocketRecordPdfLambda', () => {
  const originalStage = environment.stage;
  const originalColor = environment.currentColor;

  beforeEach(() => {
    jest
      .mocked(getMaintenanceModeMock)
      .mockResolvedValue({ current: false } as any);
    mockLambdaClientSend.mockResolvedValue({});
  });

  afterEach(() => {
    environment.stage = originalStage;
    environment.currentColor = originalColor;
  });

  const buildEvent = () => ({
    body: JSON.stringify({
      docketNumber: '101-20',
      docketRecordTableSort: { sortField: 'index', sortOrder: 'asc' },
    }),
    headers: {},
    path: '',
    pathParameters: { docketNumber: '101-20' },
    queryStringParameters: {},
  });

  it('returns a jobId and invokes the worker lambda asynchronously when deployed', async () => {
    environment.stage = 'prod';
    environment.currentColor = 'green';

    const response = await generatePublicDocketRecordPdfLambda(buildEvent());

    expect(JSON.parse(response.body).jobId).toEqual(expect.any(String));
    expect(mockLambdaClientSend).toHaveBeenCalledTimes(1);
    const command = mockLambdaClientSend.mock.calls[0][0];
    expect(command.input.FunctionName).toBe(
      'public_async_docket_record_pdf_prod_green',
    );
    expect(command.input.InvocationType).toBe('Event');
    const payload = JSON.parse(Buffer.from(command.input.Payload).toString());
    const payloadBody = JSON.parse(payload.body);
    expect(payloadBody.docketNumber).toBe('101-20');
    expect(payloadBody.jobId).toEqual(expect.any(String));
  });

  it('invokes the worker handler in-process when running locally', async () => {
    environment.stage = 'local';

    await generatePublicDocketRecordPdfLambda(buildEvent());

    expect(mockLambdaClientSend).not.toHaveBeenCalled();
    await new Promise(resolve => setImmediate(resolve));
    expect(mockWorkerHandler).toHaveBeenCalledTimes(1);
  });
});
