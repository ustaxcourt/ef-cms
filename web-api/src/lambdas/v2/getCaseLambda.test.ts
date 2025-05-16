import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock(
  '@web-api/business/useCases/featureFlag/getAllFeatureFlagsInteractor',
);
jest.mock('@web-api/persistence/dynamo/cases/getCaseByDocketNumber');
jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');
import { MOCK_CASE_WITH_TRIAL_SESSION } from '@shared/test/mockCase';
import { MOCK_COMPLEX_CASE } from '@shared/test/mockComplexCase';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';
import { getCaseLambda } from './getCaseLambda';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as mockGetCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

const mockDynamoCaseRecord = Object.assign({}, MOCK_CASE_WITH_TRIAL_SESSION, {
  entityName: 'Case',
  pk: 'case|101-18',
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

describe('getCaseLambda (which fails if version increase is needed, DO NOT CHANGE TESTS)', () => {
  let CI;
  const getCaseByDocketNumber = jest.mocked(mockGetCaseByDocketNumber);
  // disable logging by mimicking CI for this test
  beforeAll(() => {
    ({ CI } = process.env);
    process.env.CI = 'true';
  });

  afterAll(() => (process.env.CI = CI));

  // the 401 case is handled by API Gateway, and as such isn’t tested here.

  it('returns 404 when the user is not authorized and the case is not found', async () => {
    getCaseByDocketNumber.mockResolvedValue({} as any);

    const response = await getCaseLambda(REQUEST_EVENT, mockPetitionerUser);

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns 200 when the user is not associated and the case is found', async () => {
    getCaseByDocketNumber.mockResolvedValue(mockDynamoCaseRecord as any);

    const response = await getCaseLambda(REQUEST_EVENT, mockPetitionerUser);

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
    getCaseByDocketNumber.mockResolvedValue({} as any);

    const response = await getCaseLambda(REQUEST_EVENT, mockDocketClerkUser);

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns 500 on an unexpected error', async () => {
    getCaseByDocketNumber.mockRejectedValue(new Error('I had a problem :('));

    const response = await getCaseLambda(REQUEST_EVENT, mockDocketClerkUser);

    expect(response.statusCode).toBe(500);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns the case in v2 format - when the user has access to the case', async () => {
    // Careful! Changing this test would mean that the v2 format is changing;
    // this would mean breaking changes for any user of the v1 API
    getCaseByDocketNumber.mockResolvedValue({
      ...mockDynamoCaseRecord,
      docketEntries: [],
      irsPractitioners: [MOCK_COMPLEX_CASE.irsPractitioners[0]],
      privatePractitioners: [
        {
          ...MOCK_PRACTITIONER,
          entityName: 'PrivatePractitioner',
          serviceIndicator: 'Paper',
        },
      ],
    } as any);

    const response = await getCaseLambda(REQUEST_EVENT, mockDocketClerkUser);

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
