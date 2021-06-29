const createApplicationContext = require('../applicationContext');
const {
  MOCK_CASE_WITH_TRIAL_SESSION,
} = require('../../../shared/src/test/mockCase');
const { getCaseLambda } = require('./getCaseLambda');
const { MOCK_USERS } = require('../../../shared/src/test/mockUsers');

const mockDynamoCaseRecord = Object.assign({}, MOCK_CASE_WITH_TRIAL_SESSION, {
  noticeOfTrialDate: '2020-10-20T01:38:43.489Z',
  pk: 'case|123-20',
  sk: 'case|23',
});

const REQUEST_EVENT = {
  body: {},
  headers: {},
  path: '',
  pathParameters: {
    docketNumber: '123-30',
  },
  queryStringParameters: {},
};

const createSilentAppContext = user => {
  const applicationContext = createApplicationContext(user, {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  });

  applicationContext.environment.dynamoDbTableName = 'mocked';

  return applicationContext;
};

describe('getCaseLambda (which fails if version increase is needed, DO NOT CHANGE TESTS)', () => {
  let CI;
  // disable logging by mimicking CI for this test
  beforeAll(() => {
    ({ CI } = process.env);
    process.env.CI = true;
  });

  afterAll(() => (process.env.CI = CI));

  // the 401 case is handled by API Gateway, and as such isn’t tested here.

  it('returns 404 when the user is not authorized and the case is not found', async () => {
    const user = { role: 'roleWithNoPermissions' };
    const applicationContext = createSilentAppContext(user);

    // Case is retrieved before determining authorization
    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest.fn().mockReturnValue(
          Promise.resolve({
            Items: [], // no items with docket number is found
          }),
        ),
      }),
    });

    const response = await getCaseLambda(REQUEST_EVENT, {
      applicationContext,
    });

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns 200 when the user is not associated and the case is found', async () => {
    const user = { role: 'roleWithNoPermissions' };
    const applicationContext = createSilentAppContext(user);

    // Case is retrieved before determining authorization
    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest.fn().mockReturnValue(
          Promise.resolve({
            Items: [mockDynamoCaseRecord],
          }),
        ),
      }),
    });

    const response = await getCaseLambda(REQUEST_EVENT, {
      applicationContext,
    });

    expect(response.statusCode).toBe('200');
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'caseCaption',
      expect.any(String),
    );
    expect(JSON.parse(response.body).assignedJudge).toBeUndefined();
    expect(JSON.parse(response.body).contactPrimary).toBeUndefined();
    expect(JSON.parse(response.body).noticeOfTrialDate).toBeUndefined();
    expect(JSON.parse(response.body).status).toBeUndefined();
    expect(JSON.parse(response.body).trialLocation).toBeUndefined();
    expect(JSON.parse(response.body).userId).toBeUndefined();
  });

  it('returns 404 when the docket number isn’t found', async () => {
    const user = MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'];
    const applicationContext = createSilentAppContext(user);

    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest.fn().mockReturnValue(
          Promise.resolve({
            Items: [], // no items with docket number is found
          }),
        ),
      }),
    });

    const response = await getCaseLambda(REQUEST_EVENT, {
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

    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest
          .fn()
          .mockReturnValue(Promise.reject(new Error('test error'))),
      }),
    });

    const response = await getCaseLambda(REQUEST_EVENT, {
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
    // Careful! Changing this test would mean that the v1 format is changing;
    // this would mean breaking changes for any user of the v1 API
    const user = MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'];
    const applicationContext = createSilentAppContext(user);

    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest.fn().mockReturnValue(
          Promise.resolve({
            Items: [mockDynamoCaseRecord],
          }),
        ),
      }),
    });

    const response = await getCaseLambda(REQUEST_EVENT, {
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
      status: 'Calendared',
    });
  });
});
