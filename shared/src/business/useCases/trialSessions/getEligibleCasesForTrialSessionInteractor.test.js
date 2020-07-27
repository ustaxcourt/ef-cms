const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getEligibleCasesForTrialSessionInteractor,
} = require('./getEligibleCasesForTrialSessionInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

describe('getEligibleCasesForTrialSessionInteractor', () => {
  let mockCurrentUser;
  let mockTrial;

  const MOCK_TRIAL = {
    maxCases: 100,
    sessionType: 'Regular',
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  const MOCK_ASSOCIATED_CASE = {
    ...MOCK_CASE,
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
  };

  beforeEach(() => {
    mockCurrentUser = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    mockTrial = MOCK_TRIAL;

    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrial);
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockReturnValue([MOCK_CASE]);
    applicationContext
      .getUseCases()
      .getCalendaredCasesForTrialSessionInteractor.mockImplementation(() => [
        MOCK_ASSOCIATED_CASE,
      ]);
  });

  it('throws an exception when it fails to find the cases for a trial session', async () => {
    mockCurrentUser = {};

    await expect(
      getEligibleCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow();
  });

  it('should find the cases for a trial session successfully', async () => {
    await expect(
      getEligibleCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).resolves.not.toThrow();
  });

  it('should return cases that are set for this session even if uncalendared', async () => {
    mockTrial = {
      ...MOCK_TRIAL,
      caseOrder: [
        {
          docketNumber: MOCK_ASSOCIATED_CASE.docketNumber,
          isManuallyAdded: true,
        },
      ],
      isCalendared: false,
    };

    let error;
    let result;

    try {
      result = await getEligibleCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toMatchObject([MOCK_ASSOCIATED_CASE, MOCK_CASE]);
  });
});
