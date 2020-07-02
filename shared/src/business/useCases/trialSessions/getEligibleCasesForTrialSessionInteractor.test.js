const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getEligibleCasesForTrialSessionInteractor,
} = require('./getEligibleCasesForTrialSessionInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

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

describe('getEligibleCasesForTrialSessionInteractor', () => {
  it('throws an exception when it fails to find the cases for a trial session', async () => {
    let error;

    try {
      await getEligibleCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('should find the cases for a trial session successfully', async () => {
    applicationContext.getCurrentUser.mockImplementation(
      () =>
        new User({
          name: 'Docket Clerk',
          role: ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
    );
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL);
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockReturnValue([MOCK_CASE]);
    let error;

    try {
      await getEligibleCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
  });

  it('should return cases that are set for this session even if uncalendared', async () => {
    const getCalendaredCasesForTrialSessionInteractorMock = jest.fn();
    applicationContext.getCurrentUser.mockImplementation(
      () =>
        new User({
          name: 'Docket Clerk',
          role: ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
    );
    applicationContext
      .getUseCases()
      .getCalendaredCasesForTrialSessionInteractor.mockImplementation(() => {
        getCalendaredCasesForTrialSessionInteractorMock();
        return [MOCK_ASSOCIATED_CASE];
      });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => ({
        ...MOCK_TRIAL,
        caseOrder: [
          {
            caseId: MOCK_ASSOCIATED_CASE.caseId,
            isManuallyAdded: true,
          },
        ],
        isCalendared: false,
      }));
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockReturnValue([MOCK_CASE]);
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

    // expect(getCalendaredCasesForTrialSessionInteractorMock).toHaveBeenCalled();
    expect(error).toBeUndefined();
    expect(result).toMatchObject([MOCK_ASSOCIATED_CASE, MOCK_CASE]);
  });
});
