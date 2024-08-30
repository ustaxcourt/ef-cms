import {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} from '../../../../../shared/src/test/mockCase';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { getEligibleCasesForTrialSessionInteractor } from './getEligibleCasesForTrialSessionInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getEligibleCasesForTrialSessionInteractor', () => {
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
    mockTrial = MOCK_TRIAL;

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
    await expect(
      getEligibleCasesForTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow();
  });

  it('should find the cases for a trial session successfully', async () => {
    await expect(
      getEligibleCasesForTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        mockDocketClerkUser,
      ),
    ).resolves.not.toThrow();
  });

  it('should call getEligibleCasesForTrialSession with correct limit', async () => {
    await getEligibleCasesForTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockDocketClerkUser,
    );

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
        mockDocketClerkUser,
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
