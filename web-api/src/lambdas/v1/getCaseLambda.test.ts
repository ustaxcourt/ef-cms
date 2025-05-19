import '@web-api/persistence/postgres/cases/mocks.jest';
jest.mock(
  '@web-api/business/useCases/featureFlag/getAllFeatureFlagsInteractor',
);
jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');
import { MOCK_CASE_WITH_TRIAL_SESSION } from '../../../../shared/src/test/mockCase';
import { getCaseLambda } from './getCaseLambda';
import { getMaintenanceMode as getMaintenanceModeMock } from '@web-api/persistence/postgres/featureFlag/getMaintenanceMode';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as mockGetCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

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

describe('getCaseLambda (which fails if version increase is needed, DO NOT CHANGE TESTS)', () => {
  let CI;
  const getCaseByDocketNumber = jest.mocked(mockGetCaseByDocketNumber);
  const getMaintenanceMode = jest.mocked(getMaintenanceModeMock);

  const mockExpectedResponse = {
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
    sortableDocketNumber: 2018000101,
    status: 'Calendared',
  };

  // disable logging by mimicking CI for this test
  beforeAll(() => {
    ({ CI } = process.env);
    process.env.CI = 'true';
  });
  beforeEach(() => {
    getMaintenanceMode.mockResolvedValue({ current: false });
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
    expect(JSON.parse(response.body).noticeOfTrialDate).toBeUndefined();
    expect(JSON.parse(response.body).status).toBeUndefined();
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

  it('returns the case in v1 format - when the user has access to the case', async () => {
    // Careful! Changing this test would mean that the v1 format is changing;
    // this would mean breaking changes for any user of the v1 API
    getCaseByDocketNumber.mockResolvedValue({
      ...mockDynamoCaseRecord,
      docketEntries: [],
    } as any);

    const response = await getCaseLambda(REQUEST_EVENT, mockDocketClerkUser);

    expect(response.statusCode).toBe('200');
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toMatchObject(mockExpectedResponse);
  });
});
