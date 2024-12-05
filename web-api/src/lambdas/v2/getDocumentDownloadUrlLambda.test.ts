import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  CASE_STATUS_TYPES,
  Role,
} from '@shared/business/entities/EntityConstants';
import { MOCK_PETITION } from '@shared/test/mockDocketEntry';
import { getDocumentDownloadUrlLambda } from './getDocumentDownloadUrlLambda';
import { createTestApplicationContext as mockCreateTestApplicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { getDownloadPolicyUrlInteractor as mockGetDownloadPolicyUrlInteractor } from '@web-api/business/useCases/document/getDownloadPolicyUrlInteractor';

jest.mock('@web-api/applicationContext', () => {
  return {
    createApplicationContext: () => {
      let appContext = mockCreateTestApplicationContext();
      appContext.getUseCases().getAllFeatureFlagsInteractor = jest
        .fn()
        .mockResolvedValue(mockFeatureFlag);
      appContext.getUseCases().getDownloadPolicyUrlInteractor = jest
        .fn()
        .mockImplementation(mockGetDownloadPolicyUrlInteractor);

      appContext.getDocumentClient = jest.fn().mockReturnValue({
        query: jest.fn().mockResolvedValue({
          Items: mockItems,
        }),
      });

      appContext.getPersistenceGateway().getDownloadPolicyUrl = jest
        .fn()
        .mockImplementation(({ key, useTempBucket }) => {
          return {
            url: `https://example.com/download-policy-url/${
              useTempBucket ? 'temp-' : ''
            }bucket/item/${key}`,
          };
        });

      if (mockShouldThrowError) {
        appContext.getDocumentClient = jest.fn().mockReturnValue({
          query: jest.fn().mockRejectedValue(new Error('test error')),
        });
      }

      return appContext;
    },
  };
});

let mockFeatureFlag;
let mockShouldThrowError;
let mockItems;
const setupMock = ({
  featureFlag,
  items,
  shouldThrowError,
}: {
  items: any[];
  featureFlag: boolean;
  shouldThrowError: boolean;
}) => {
  mockShouldThrowError = shouldThrowError;
  mockFeatureFlag = featureFlag;
  mockItems = items;
};

const REQUEST_EVENT = {
  body: {},
  headers: {},
  path: '',
  pathParameters: {},
  queryStringParameters: {},
};

describe('getDocumentDownloadUrlLambda', () => {
  let CI;
  // disable logging by mimicking CI for this test
  beforeAll(() => {
    ({ CI } = process.env);
    process.env.CI = 'true';
  });

  afterAll(() => (process.env.CI = CI));

  // the 401 case is handled by API Gateway, and as such isn’t tested here.

  it('returns 403 when the user is not authorized', async () => {
    setupMock({
      featureFlag: true,
      items: [],
      shouldThrowError: false,
    });

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

    setupMock({
      featureFlag: true,
      items: [],
      shouldThrowError: false,
    });

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

    setupMock({
      featureFlag: true,
      items: [
        {
          docketNumber: '123-20',
          judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
          pk: 'case|123-20',
          sk: 'case|123-20',
          status: CASE_STATUS_TYPES.generalDocket,
        },
        {
          ...MOCK_PETITION,
          // docket entry does not match the requested entry
          docketEntryId: '26c6a0e5-5d11-45f0-9904-04d103ada04f',
          pk: 'case|123-20',
          sk: 'docket-entry|26c6a0e5-5d11-45f0-9904-04d103ada04f',
        },
      ],
      shouldThrowError: false,
    });

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

    setupMock({
      featureFlag: true,
      items: [],
      shouldThrowError: true,
    });

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

  [true, false].forEach(isFeatureFlagOn => {
    it(`returns the document download URL in v2 format - when feature flag is ${isFeatureFlagOn}`, async () => {
      const request = Object.assign({}, REQUEST_EVENT, {
        pathParameters: {
          docketNumber: '123-30',
          key: '26c6a0e5-5d11-45f0-9904-04d103ada04f',
        },
      });

      setupMock({
        featureFlag: isFeatureFlagOn,
        items: [
          {
            docketNumber: '123-20',
            judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
            pk: 'case|123-20',
            sk: 'case|123-20',
            status: CASE_STATUS_TYPES.generalDocket,
          },
          {
            ...MOCK_PETITION,
            // docket entry does not match the requested entry
            docketEntryId: '26c6a0e5-5d11-45f0-9904-04d103ada04f',
            pk: 'case|123-20',
            sk: 'docket-entry|26c6a0e5-5d11-45f0-9904-04d103ada04f',
          },
        ],
        shouldThrowError: false,
      });

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
});
