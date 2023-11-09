import {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} from '../../../test/mockCase';
import {
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../entities/EntityConstants';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { getEligibleCasesForTrialSessionInteractor } from './getEligibleCasesForTrialSessionInteractor';

describe('getEligibleCasesForTrialSessionInteractor', () => {
  let mockCurrentUser;
  let mockTrial;

  const MOCK_TRIAL = {
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionType: 'Regular',
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  const MOCK_ASSOCIATED_CASE = {
    ...MOCK_CASE,
    ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
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
      .getEligibleCasesForTrialSession.mockReturnValue([MOCK_ELIGIBLE_CASE]);
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockImplementation(() => [
        MOCK_ASSOCIATED_CASE,
      ]);
  });

  it('throws an exception when it fails to find the cases for a trial session', async () => {
    mockCurrentUser = {};

    await expect(
      getEligibleCasesForTrialSessionInteractor(applicationContext, {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow();
  });

  it('should find the cases for a trial session successfully', async () => {
    await expect(
      getEligibleCasesForTrialSessionInteractor(applicationContext, {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).resolves.not.toThrow();
  });

  it('should call getEligibleCasesForTrialSession with correct limit', async () => {
    await getEligibleCasesForTrialSessionInteractor(applicationContext, {
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(
      applicationContext.getPersistenceGateway().getEligibleCasesForTrialSession
        .mock.calls[0][0],
    ).toMatchObject({
      limit: 150, // max cases + buffer
    });
  });

  it('should return cases that are set for this session even if uncalendared', async () => {
    const mockEligibleCaseWithPractitioners = cloneDeep(
      MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
    );
    const mockEligibleCase = cloneDeep(MOCK_ELIGIBLE_CASE);

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
      result = await getEligibleCasesForTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toMatchObject([
      mockEligibleCaseWithPractitioners,
      mockEligibleCase,
    ]);
  });
});
