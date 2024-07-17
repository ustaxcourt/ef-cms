import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { MOCK_CASE_WITH_TRIAL_SESSION } from '../../../../shared/src/test/mockCase';
import { MOCK_USERS } from '../../../../shared/src/test/mockUsers';
import { Role } from '@shared/business/entities/EntityConstants';
import { getCaseLambda } from './getCaseLambda';
import { createTestApplicationContext as mockCreateTestApplicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseInteractor as mockGetCaseInteractor } from '@shared/business/useCases/getCaseInteractor';

jest.mock('@web-api/applicationContext', () => {
  return {
    createApplicationContext: user => {
      let appContext = mockCreateTestApplicationContext(user);
      appContext.getUseCases().getAllFeatureFlagsInteractor = jest
        .fn()
        .mockResolvedValue(mockFeatureFlag);
      appContext.getDocumentClient = jest.fn().mockReturnValue({
        query: jest.fn().mockResolvedValue({
          Items: mockItems, // no items with docket number is found
        }),
      });
      appContext.getUseCases().getCaseInteractor = jest
        .fn()
        .mockImplementation(mockGetCaseInteractor);

      appContext.getCurrentUser = jest.fn().mockReturnValue(mockUser);

      if (mockShouldThrowError) {
        appContext.getDocumentClient = jest.fn().mockReturnValue({
          query: jest.fn().mockRejectedValue(new Error('test error')),
        });
      }

      return appContext;
    },
  };
});

const mockDynamoCaseRecord = Object.assign({}, MOCK_CASE_WITH_TRIAL_SESSION, {
  noticeOfTrialDate: '2020-10-20T01:38:43.489Z',
  pk: 'case|123-20',
  sk: 'case|23',
});

let mockItems;
let mockFeatureFlag;
let mockShouldThrowError;
let mockUser;
const setupMock = ({
  featureFlag,
  items,
  shouldThrowError,
  user,
}: {
  items: (typeof mockDynamoCaseRecord)[];
  featureFlag: boolean;
  shouldThrowError: boolean;
  user: AuthUser;
}) => {
  mockUser = user;
  mockItems = items;
  mockShouldThrowError = shouldThrowError;
  mockFeatureFlag = featureFlag;
};

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
    process.env.CI = true;
  });

  afterAll(() => (process.env.CI = CI));

  // the 401 case is handled by API Gateway, and as such isn’t tested here.

  it('returns 404 when the user is not authorized and the case is not found', async () => {
    setupMock({
      featureFlag: true,
      items: [],
      shouldThrowError: false,
      user: {
        email: '',
        name: '',
        role: 'roleWithNoPermissions' as Role,
        userId: '',
      },
    });

    const response = await getCaseLambda(REQUEST_EVENT, {});

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns 200 when the user is not associated and the case is found', async () => {
    setupMock({
      featureFlag: true,
      items: [mockDynamoCaseRecord],
      shouldThrowError: false,
      user: {
        email: '',
        name: '',
        role: 'roleWithNoPermissions' as Role,
        userId: '',
      },
    });

    const response = await getCaseLambda(REQUEST_EVENT, {});

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
    setupMock({
      featureFlag: true,
      items: [],
      shouldThrowError: false,
      user: MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'] as AuthUser,
    });

    const response = await getCaseLambda(REQUEST_EVENT, {});

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns 500 on an unexpected error', async () => {
    setupMock({
      featureFlag: true,
      items: [],
      shouldThrowError: true,
      user: MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'] as AuthUser,
    });

    const response = await getCaseLambda(REQUEST_EVENT, {});

    expect(response.statusCode).toBe(500);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  [true, false].forEach(isFeatureFlagOn => {
    it(`returns the case in v1 format - when feature flag is ${isFeatureFlagOn}`, async () => {
      // Careful! Changing this test would mean that the v1 format is changing;
      // this would mean breaking changes for any user of the v1 API
      setupMock({
        featureFlag: isFeatureFlagOn,
        items: [mockDynamoCaseRecord],
        shouldThrowError: false,
        user: MOCK_USERS['b7d90c05-f6cd-442c-a168-202db587f16f'] as AuthUser,
      });

      const response = await getCaseLambda(REQUEST_EVENT, {});

      expect(response.statusCode).toBe('200');
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(response.body)).toMatchObject(mockExpectedResponse);
    });
  });
});
