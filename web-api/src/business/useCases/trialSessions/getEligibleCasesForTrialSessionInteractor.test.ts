import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} from '../../../../../shared/src/test/mockCase';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { getEligibleCasesForTrialSessionInteractor } from './getEligibleCasesForTrialSessionInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getCalendaredCasesForTrialSession as getCalendaredCasesForTrialSessionMock } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';

describe('getEligibleCasesForTrialSessionInteractor', () => {
  let mockTrial;

  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const getCalendaredCasesForTrialSession = jest.mocked(
    getCalendaredCasesForTrialSessionMock,
  );

  const MOCK_TRIAL = {
    maxCases: 100,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    sessionType: SESSION_TYPES.regular,
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  const MOCK_ASSOCIATED_CASE: Omit<RawCase, 'consolidatedCases'> & TCaseOrder =
    {
      ...MOCK_CASE,
      ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
      addedToSessionAt: '2100-12-01T00:00:00.000Z',
      isHearing: true,
      isManuallyAdded: true,
      removedFromTrial: false,
    };

  beforeEach(() => {
    mockTrial = MOCK_TRIAL;

    getTrialSessionById.mockImplementation(() => mockTrial);
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockReturnValue([
        { ...MOCK_ELIGIBLE_CASE, docketEntries: [] },
      ]);
    getCalendaredCasesForTrialSession.mockResolvedValue([MOCK_ASSOCIATED_CASE]);
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
    expect(getCalendaredCasesForTrialSession).toHaveBeenCalledWith({
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      excludeFields: ['correspondence', 'hearings'],
    });
  });

  it('should throw error if trial session is not found', async () => {
    getTrialSessionById.mockResolvedValueOnce(undefined);
    await expect(
      getEligibleCasesForTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(
      'Trial session 6805d1ab-18d0-43ec-bafb-654e83405416 was not found.',
    );
  });

  it('should assign isAgedCase property', async () => {
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
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession.mockReturnValue([
        { ...MOCK_ELIGIBLE_CASE, docketEntries: MOCK_DOCUMENTS },
      ]);
    const result = await getEligibleCasesForTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockDocketClerkUser,
    );
    expect(result[0].isAgedCase).toBe(true);
    expect(result[1].isAgedCase).toBe(true);
  });
});
