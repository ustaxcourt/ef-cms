jest.mock(
  '@web-api/business/useCases/featureFlag/getAllFeatureFlagsFromPostgresInteractor',
);
jest.mock('@web-api/persistence/dynamo/cases/getCaseByDocketNumber');
jest.mock('@web-api/persistence/s3/getDownloadPolicyUrl');
jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');
import {
  CASE_STATUS_TYPES,
  Role,
} from '@shared/business/entities/EntityConstants';
import { MOCK_PETITION } from '@shared/test/mockDocketEntry';
import { getAllFeatureFlagsFromPostgresInteractor as getAllFeatureFlagsFromPostgresInteractorMock } from '@web-api/business/useCases/featureFlag/getAllFeatureFlagsFromPostgresInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import { getDocumentDownloadUrlLambda } from './getDocumentDownloadUrlLambda';
import { getDownloadPolicyUrl as getDownloadPolicyUrlMock } from '@web-api/persistence/s3/getDownloadPolicyUrl';
import { getMaintenanceMode as getMaintenanceModeMock } from '@web-api/persistence/postgres/featureFlag/getMaintenanceMode';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

const REQUEST_EVENT = {
  body: {},
  headers: {},
  path: '',
  pathParameters: {},
  queryStringParameters: {},
};

describe('getDocumentDownloadUrlLambda', () => {
  let CI;
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getMaintenanceMode = jest.mocked(getMaintenanceModeMock);
  const getAllFeatureFlagsFromPostgresInteractor = jest.mocked(
    getAllFeatureFlagsFromPostgresInteractorMock,
  );
  const getDownloadPolicyUrl = jest.mocked(getDownloadPolicyUrlMock);

  // disable logging by mimicking CI for this test
  beforeAll(() => {
    ({ CI } = process.env);
    process.env.CI = 'true';
  });

  beforeEach(() => {
    getAllFeatureFlagsFromPostgresInteractor.mockResolvedValue({});
    getMaintenanceMode.mockResolvedValue({ current: false });
    getDownloadPolicyUrl.mockImplementation(({ key, useTempBucket }) => {
      return Promise.resolve({
        url: `https://example.com/download-policy-url/${
          useTempBucket ? 'temp-' : ''
        }bucket/item/${key}`,
      });
    });
  });

  afterAll(() => (process.env.CI = CI));

  // the 401 case is handled by API Gateway, and as such isn’t tested here.

  it('returns 403 when the user is not authorized', async () => {
    getCaseByDocketNumber.mockResolvedValue({} as any);

    const response = await getDocumentDownloadUrlLambda(REQUEST_EVENT, {
      email: 'test@e.mail',
      name: '',
      role: 'roleWithNoPermissions' as Role,
      userId: '612e3eb3-332c-4f1f-aaff-44ac8eae9a5f',
    });

    expect(response.statusCode).toBe(403);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty('message', 'Unauthorized');
  });

  it('returns 404 when the docket number isn’t found', async () => {
    const request = Object.assign({}, REQUEST_EVENT, {
      pathParameters: {
        docketNumber: '1234-19',
        key: '530d4b65-620a-489d-8414-6623653ebb3a',
      },
    });
    getCaseByDocketNumber.mockResolvedValue({} as any);

    const response = await getDocumentDownloadUrlLambda(
      request,
      mockDocketClerkUser,
    );

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns 404 when the entity GUID isn’t found', async () => {
    const request = Object.assign({}, REQUEST_EVENT, {
      pathParameters: {
        docketNumber: '123-30',
        key: '530d4b65-620a-489d-8414-6623653ebb3a',
      },
    });
    getCaseByDocketNumber.mockResolvedValue({
      docketEntries: [
        {
          ...MOCK_PETITION,
          // docket entry does not match the requested entry
          docketEntryId: '26c6a0e5-5d11-45f0-9904-04d103ada04f',
        },
      ],
      docketNumber: '123-20',
      judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
      status: CASE_STATUS_TYPES.generalDocket,
    } as any);

    const response = await getDocumentDownloadUrlLambda(
      request,
      mockDocketClerkUser,
    );

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns 500 on an unexpected error', async () => {
    const request = Object.assign({}, REQUEST_EVENT, {
      pathParameters: {
        docketNumber: '123-30',
        key: '530d4b65-620a-489d-8414-6623653ebb3a',
      },
    });
    getCaseByDocketNumber.mockRejectedValue(new Error('I broke'));

    const response = await getDocumentDownloadUrlLambda(
      request,
      mockDocketClerkUser,
    );

    expect(response.statusCode).toBe(500);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns the document download URL in v1 format - when the document exists', async () => {
    const request = Object.assign({}, REQUEST_EVENT, {
      pathParameters: {
        docketNumber: '123-30',
        key: '26c6a0e5-5d11-45f0-9904-04d103ada04f',
      },
    });
    getCaseByDocketNumber.mockResolvedValue({
      docketEntries: [
        {
          ...MOCK_PETITION,
          // docket entry does not match the requested entry
          docketEntryId: '26c6a0e5-5d11-45f0-9904-04d103ada04f',
        },
      ],
      docketNumber: '123-20',
      judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
      status: CASE_STATUS_TYPES.generalDocket,
    } as any);

    const response = await getDocumentDownloadUrlLambda(
      request,
      mockDocketClerkUser,
    );

    expect(response.statusCode).toBe('200');
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'url',
      'https://example.com/download-policy-url/bucket/item/26c6a0e5-5d11-45f0-9904-04d103ada04f',
    );
  });
});
