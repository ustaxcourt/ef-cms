import { MOCK_USERS } from '../../../../shared/src/test/mockUsers';
import { createSilentApplicationContext } from '../../../../shared/src/business/test/createSilentApplicationContext';
import { getDocumentDownloadUrlLambda } from './getDocumentDownloadUrlLambda';

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
    process.env.CI = true;
  });

  afterAll(() => (process.env.CI = CI));

  // the 401 case is handled by API Gateway, and as such isn’t tested here.

  it('returns 403 when the user is not authorized', async () => {
    const user = { role: 'roleWithNoPermissions' };
    const applicationContext = createSilentApplicationContext(user);
    applicationContext.getUseCases().getAllFeatureFlagsInteractor = jest
      .fn()
      .mockResolvedValue(true);

    const response = await getDocumentDownloadUrlLambda(REQUEST_EVENT, {
      applicationContext,
    });

    expect(response.statusCode).toBe(403);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty('message', 'Unauthorized');
  });

  it('returns 404 when the docket number isn’t found', async () => {
    const user = MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'];
    const applicationContext = createSilentApplicationContext(user);
    applicationContext.getUseCases().getAllFeatureFlagsInteractor = jest
      .fn()
      .mockResolvedValue(true);

    const request = Object.assign({}, REQUEST_EVENT, {
      pathParameters: {
        docketNumber: '1234-19',
        key: '530d4b65-620a-489d-8414-6623653ebb3a',
      },
    });

    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest.fn().mockReturnValue(
          Promise.resolve({
            Items: [], // no items with docket number is found
          }),
        ),
      }),
    });

    applicationContext.getPersistenceGateway().getDownloadPolicyUrl = jest
      .fn()
      .mockImplementation(({ key, useTempBucket }) => {
        return {
          url: `https://example.com/download-policy-url/${
            useTempBucket ? 'temp-' : ''
          }bucket/item/${key}`,
        };
      });

    const response = await getDocumentDownloadUrlLambda(request, {
      applicationContext,
    });

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns 404 when the entity GUID isn’t found', async () => {
    const user = MOCK_USERS['2eee98ac-613f-46bc-afd5-2574d1b15664'];
    const applicationContext = createSilentApplicationContext(user);
    applicationContext.getUseCases().getAllFeatureFlagsInteractor = jest
      .fn()
      .mockResolvedValue(true);
    const request = Object.assign({}, REQUEST_EVENT, {
      pathParameters: {
        docketNumber: '123-30',
        key: '530d4b65-620a-489d-8414-6623653ebb3a',
      },
    });

    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest.fn().mockReturnValue(
          Promise.resolve({
            Items: [
              {
                docketNumber: '123-20',
                judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
                pk: 'case|123-20',
                sk: 'case|23',
                status: 'New',
              },
              {
                archived: false,
                // docket entry does not match the requested entry
                docketEntryId: '26c6a0e5-5d11-45f0-9904-04d103ada04f',
                pk: 'case|123-20',
                sk: 'docket-entry|124',
              },
            ],
          }),
        ),
      }),
    });

    applicationContext.getPersistenceGateway().getDownloadPolicyUrl = jest
      .fn()
      .mockImplementation(({ key, useTempBucket }) => {
        return {
          url: `https://example.com/download-policy-url/${
            useTempBucket ? 'temp-' : ''
          }bucket/item/${key}`,
        };
      });

    const response = await getDocumentDownloadUrlLambda(request, {
      applicationContext,
    });

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns 500 on an unexpected error', async () => {
    const user = MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'];
    const applicationContext = createSilentApplicationContext(user);
    applicationContext.getUseCases().getAllFeatureFlagsInteractor = jest
      .fn()
      .mockResolvedValue(true);
    const request = Object.assign({}, REQUEST_EVENT, {
      pathParameters: {
        docketNumber: '123-30',
        key: '530d4b65-620a-489d-8414-6623653ebb3a',
      },
    });

    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest
          .fn()
          .mockReturnValue(Promise.reject(new Error('test error'))),
      }),
    });

    const response = await getDocumentDownloadUrlLambda(request, {
      applicationContext,
    });

    expect(response.statusCode).toBe(500);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  [true, false].forEach(isFeatureFlagOn => {
    it(`returns the document download URL in v1 format - when feature flag is ${isFeatureFlagOn}`, async () => {
      const user = MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'];
      const applicationContext = createSilentApplicationContext(user);

      applicationContext.getUseCases().getAllFeatureFlagsInteractor = jest
        .fn()
        .mockResolvedValue(isFeatureFlagOn);

      const request = Object.assign({}, REQUEST_EVENT, {
        pathParameters: {
          docketNumber: '123-30',
          key: '26c6a0e5-5d11-45f0-9904-04d103ada04f',
        },
      });

      applicationContext.getDocumentClient = jest.fn().mockReturnValue({
        query: jest.fn().mockReturnValue({
          promise: jest.fn().mockReturnValue(
            Promise.resolve({
              Items: [
                {
                  docketNumber: '123-20',
                  judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
                  pk: 'case|123-20',
                  sk: 'case|23',
                  status: 'New',
                },
                {
                  archived: false,
                  docketEntryId: '26c6a0e5-5d11-45f0-9904-04d103ada04f',
                  pk: 'case|123-20',
                  sk: 'docket-entry|124',
                },
              ],
            }),
          ),
        }),
      });

      applicationContext.getPersistenceGateway().getDownloadPolicyUrl = jest
        .fn()
        .mockImplementation(({ key, useTempBucket }) => {
          return {
            url: `https://example.com/download-policy-url/${
              useTempBucket ? 'temp-' : ''
            }bucket/item/${key}`,
          };
        });

      const response = await getDocumentDownloadUrlLambda(request, {
        applicationContext,
      });

      expect(response.statusCode).toBe('200');
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(response.body)).toHaveProperty(
        'url',
        'https://example.com/download-policy-url/bucket/item/26c6a0e5-5d11-45f0-9904-04d103ada04f',
      );
    });
  });
});
