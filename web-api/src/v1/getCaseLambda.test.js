const createApplicationContext = require('../applicationContext');
const { getCaseLambda } = require('./getCaseLambda');
const { MOCK_CASE } = require('../../../shared/src/test/mockCase');
const { MOCK_USERS } = require('../../../shared/src/test/mockUsers');

const REQUEST_EVENT = {
  body: {},
  headers: {},
  path: '',
  pathParameters: {},
  queryStringParameters: {},
};

const createSilentAppContext = user => {
  const applicationContext = createApplicationContext(user);
  applicationContext.environment.dynamoDbTableName = 'mocked';

  applicationContext.logger = {
    error: jest.fn(),
    info: jest.fn(),
    time: () => jest.fn().mockReturnValue(null),
    timeEnd: () => jest.fn().mockReturnValue(null),
  };

  return applicationContext;
};

describe('getCaseLambda', () => {
  let CI;
  // disable logging by mimicking CI for this test
  beforeAll(() => {
    ({ CI } = process.env);
    process.env.CI = true;
  });

  afterAll(() => (process.env.CI = CI));

  // the 401 case is handled by API Gateway, and as such isn’t tested here.

  // BUG: Returns 404 before a 403.
  it.skip('returns 403 when the user is not authorized', async () => {
    const user = { role: 'roleWithNoPermissions' };
    const applicationContext = createSilentAppContext(user);

    const response = await getCaseLambda(REQUEST_EVENT, {
      applicationContext,
    });

    expect(response.statusCode).toBe(403);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty('message', 'Unauthorized');
  });

  it('returns 404 when the docket number isn’t found', async () => {
    const user = MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'];
    const applicationContext = createSilentAppContext(user);
    const request = Object.assign({}, REQUEST_EVENT, {
      pathParameters: {
        docketNumber: '1234-19',
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

    const response = await getCaseLambda(request, {
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
    const applicationContext = createSilentAppContext(user);
    const request = Object.assign({}, REQUEST_EVENT, {
      pathParameters: {
        docketNumber: '123-30',
      },
    });

    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest
          .fn()
          .mockReturnValue(Promise.reject(new Error('test error'))),
      }),
    });

    const response = await getCaseLambda(request, {
      applicationContext,
    });

    expect(response.statusCode).toBe(500);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns the case in v1 format', async () => {
    const user = MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'];
    const applicationContext = createSilentAppContext(user);
    const request = Object.assign({}, REQUEST_EVENT, {
      pathParameters: {
        docketNumber: '123-30',
      },
    });
    const mock = Object.assign({}, MOCK_CASE, {
      noticeOfTrialDate: '2020-10-20T01:38:43.489Z',
      pk: 'case|123-20',
      sk: 'case|23',
    });

    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest.fn().mockReturnValue(
          Promise.resolve({
            Items: [mock],
          }),
        ),
      }),
    });

    const response = await getCaseLambda(request, {
      applicationContext,
    });

    expect(response.statusCode).toBe('200');
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toMatchObject({
      caseCaption: 'Test Petitioner, Petitioner',
      caseType: 'Other',
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
      },
      docketEntries: [],
      docketNumber: '101-18',
      docketNumberSuffix: null,
      filingType: 'Myself',
      noticeOfTrialDate: '2020-10-20T01:38:43.489Z',
      partyType: 'Petitioner',
      practitioners: [],
      preferredTrialCity: 'Washington, District of Columbia',
      respondents: [],
      sortableDocketNumber: 18000101,
      status: 'New',
    });
  });
});
