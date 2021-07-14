const createApplicationContext = require('../applicationContext');
const {
  MOCK_CASE_WITH_TRIAL_SESSION,
} = require('../../../shared/src/test/mockCase');
const {
  MOCK_COMPLEX_CASE,
} = require('../../../shared/src/test/mockComplexCase');
const {
  MOCK_PRACTITIONER,
  MOCK_USERS,
} = require('../../../shared/src/test/mockUsers');
const { getCaseLambda } = require('./getCaseLambda');

const mockDynamoCaseRecord = Object.assign({}, MOCK_CASE_WITH_TRIAL_SESSION, {
  entityName: 'Case',
  pk: 'case|101-18',
  sk: 'case|23',
});

const mockIrsPractitionerRecord = Object.assign(
  {},
  MOCK_COMPLEX_CASE.irsPractitioners[0],
  {
    entityName: 'IrsPractitioner',
    pk: 'case|101-18',
    sk: 'irsPractitioner|23',
  },
);

const mockPrivatePractitionerRecord = Object.assign({}, MOCK_PRACTITIONER, {
  entityName: 'PrivatePractitioner',
  pk: 'case|101-18',
  serviceIndicator: 'Paper',
  sk: 'privatePractitioner|23',
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
    expect(JSON.parse(response.body).status).toBeUndefined();
    expect(JSON.parse(response.body).trialDate).toBeUndefined();
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

  it('returns the case in v2 format', async () => {
    // Careful! Changing this test would mean that the v2 format is changing;
    // this would mean breaking changes for any user of the v1 API
    const user = MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'];
    const applicationContext = createSilentAppContext(user);

    applicationContext.getDocumentClient = jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        promise: jest.fn().mockReturnValue(
          Promise.resolve({
            Items: [
              mockDynamoCaseRecord,
              mockIrsPractitionerRecord,
              mockPrivatePractitionerRecord,
            ],
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
        serviceIndicator: 'Electronic',
        state: 'TN',
      },
      docketEntries: [],
      docketNumber: '101-18',
      docketNumberSuffix: null,
      filingType: 'Myself',
      partyType: 'Petitioner',
      practitioners: [
        {
          barNumber: 'AB1111',
          contact: {
            address1: '234 Main St',
            address2: 'Apartment 4',
            address3: 'Under the stairs',
            city: 'Chicago',
            phone: '+1 (555) 555-5555',
            postalCode: '61234',
            state: 'IL',
          },
          email: 'ab@example.com',
          firmName: 'GW Law Offices',
          name: 'Test Attorney',
          serviceIndicator: 'Paper',
        },
      ],
      preferredTrialCity: 'Washington, District of Columbia',
      respondents: [
        {
          barNumber: 'VS0062',
          contact: {
            address1: '016 Miller Loop Apt. 494',
            address2: 'Apt. 835',
            city: 'Cristianville',
            phone: '001-016-669-6532x5946',
            postalCode: '68117',
            state: 'NE',
          },
          email: 'adam22@example.com',
          name: 'Isaac Benson',
          serviceIndicator: 'Electronic',
        },
      ],
      sortableDocketNumber: 18000101,
      status: 'Calendared',
      trialDate: '2020-03-01T00:00:00.000Z',
      trialLocation: 'Washington, District of Columbia',
    });
  });
});
