import { MOCK_CASE_WITH_TRIAL_SESSION } from '../../../../shared/src/test/mockCase';
import { MOCK_COMPLEX_CASE } from '../../../../shared/src/test/mockComplexCase';
import {
  MOCK_PRACTITIONER,
  MOCK_USERS,
} from '../../../../shared/src/test/mockUsers';
import { createSilentApplicationContext } from '../../../../shared/src/business/test/createSilentApplicationContext';
import { getCaseLambda } from './getCaseLambda';

describe('getCaseLambda (which fails if version increase is needed, DO NOT CHANGE TESTS)', () => {
  let CI;
  // disable logging by mimicking CI for this test
  beforeAll(() => {
    ({ CI } = process.env);
    process.env.CI = true;
  });
  let mockDynamoCaseRecord;
  let mockIrsPractitionerRecord;
  let mockPrivatePractitionerRecord;
  let REQUEST_EVENT;

  afterAll(() => (process.env.CI = CI));
  beforeEach(() => {
    mockDynamoCaseRecord = Object.assign({}, MOCK_CASE_WITH_TRIAL_SESSION, {
      entityName: 'Case',
      pk: 'case|101-18',
      sk: 'case|23',
    });

    mockIrsPractitionerRecord = Object.assign(
      {},
      MOCK_COMPLEX_CASE.irsPractitioners[0],
      {
        entityName: 'IrsPractitioner',
        pk: 'case|101-18',
        sk: 'irsPractitioner|23',
      },
    );

    mockPrivatePractitionerRecord = Object.assign({}, MOCK_PRACTITIONER, {
      entityName: 'PrivatePractitioner',
      pk: 'case|101-18',
      serviceIndicator: 'Paper',
      sk: 'privatePractitioner|23',
    });

    REQUEST_EVENT = {
      body: {},
      headers: {},
      path: '',
      pathParameters: {
        docketNumber: '123-30',
      },
      queryStringParameters: {},
    };
  });

  // the 401 case is handled by API Gateway, and as such isn’t tested here.

  it('returns 404 when the user is not authorized and the case is not found', async () => {
    const user = { role: 'roleWithNoPermissions' };
    const applicationContext = createSilentApplicationContext(user);

    applicationContext.getUseCases().getAllFeatureFlagsInteractor = jest
      .fn()
      .mockResolvedValue(true);

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
    const applicationContext = createSilentApplicationContext(user);

    applicationContext.getUseCases().getAllFeatureFlagsInteractor = jest
      .fn()
      .mockResolvedValue(true);

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
    const applicationContext = createSilentApplicationContext(user);

    applicationContext.getUseCases().getAllFeatureFlagsInteractor = jest
      .fn()
      .mockResolvedValue(true);

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
    const applicationContext = createSilentApplicationContext(user);

    applicationContext.getUseCases().getAllFeatureFlagsInteractor = jest
      .fn()
      .mockResolvedValue(true);

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

  [true, false].forEach(isFeatureFlagOn => {
    it(`returns the case in v2 format - when feature flag is ${isFeatureFlagOn}`, async () => {
      // Careful! Changing this test would mean that the v2 format is changing;
      // this would mean breaking changes for any user of the v1 API
      const user = MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'];
      const applicationContext = createSilentApplicationContext(user);

      applicationContext.getUseCases().getAllFeatureFlagsInteractor = jest
        .fn()
        .mockResolvedValue(isFeatureFlagOn);

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
        sortableDocketNumber: 2018000101,
        status: 'Calendared',
        trialDate: '2020-03-01T00:00:00.000Z',
        trialLocation: 'Washington, District of Columbia',
      });
    });
  });
});
