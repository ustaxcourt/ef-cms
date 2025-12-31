import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import {
  InvalidRequest,
  NotFoundError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import {
  mockChambersUser,
  mockPetitionerUser,
  mockTrialClerkUser,
} from '@shared/test/mockAuthUsers';
import { validateCaseForNewMinuteSheetInteractor } from './validateCaseForNewMinuteSheetInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getConsolidatedCases as getConsolidatedCasesMock } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

describe('validateCaseForNewMinuteSheetInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const getConsolidatedCases = jest.mocked(getConsolidatedCasesMock);

  const mockTrialSessionId = MOCK_TRIAL_REGULAR.trialSessionId!;

  // Create a mock trial session WITHOUT the test case in caseOrder (for testing unscheduled cases)
  const mockTrialSessionWithoutCase = {
    ...MOCK_TRIAL_REGULAR,
    caseOrder: [], // Empty caseOrder means case is NOT on the session
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    // Default to trial session without the case (for unscheduled case testing)
    getTrialSessionById.mockResolvedValue(mockTrialSessionWithoutCase);
    getConsolidatedCases.mockResolvedValue([]);
  });

  it('should throw UnauthorizedError when user does not have MANAGE_MINUTE_SHEET permission', async () => {
    await expect(
      validateCaseForNewMinuteSheetInteractor(
        {
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: mockTrialSessionId,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw NotFoundError when case does not exist', async () => {
    getCaseByDocketNumber.mockResolvedValue(undefined as any);

    await expect(
      validateCaseForNewMinuteSheetInteractor(
        {
          docketNumber: '999-99',
          trialSessionId: mockTrialSessionId,
        },
        mockTrialClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
    await expect(
      validateCaseForNewMinuteSheetInteractor(
        {
          docketNumber: '999-99',
          trialSessionId: mockTrialSessionId,
        },
        mockTrialClerkUser,
      ),
    ).rejects.toThrow('Case 999-99 was not found.');
  });

  it('should throw NotFoundError when trial session does not exist', async () => {
    getTrialSessionById.mockResolvedValue(undefined);

    await expect(
      validateCaseForNewMinuteSheetInteractor(
        {
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: 'non-existent-session-id',
        },
        mockTrialClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
    await expect(
      validateCaseForNewMinuteSheetInteractor(
        {
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: 'non-existent-session-id',
        },
        mockTrialClerkUser,
      ),
    ).rejects.toThrow(
      'Trial session non-existent-session-id was not found.',
    );
  });

  it('should throw InvalidRequest when case is already calendared on the trial session', async () => {
    // Set up trial session WITH the case in caseOrder (case IS on the session)
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [
        {
          docketNumber: MOCK_CASE.docketNumber,
          removedFromTrial: false,
        },
      ],
    });

    await expect(
      validateCaseForNewMinuteSheetInteractor(
        {
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: mockTrialSessionId,
        },
        mockTrialClerkUser,
      ),
    ).rejects.toThrow(InvalidRequest);
    await expect(
      validateCaseForNewMinuteSheetInteractor(
        {
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: mockTrialSessionId,
        },
        mockTrialClerkUser,
      ),
    ).rejects.toThrow(
      `Case ${MOCK_CASE.docketNumber} is already associated with this trial session.`,
    );
  });

  it('should return case info when case is valid and NOT on the trial session (unscheduled case)', async () => {
    // Default mock has empty caseOrder (case NOT on session)
    const result = await validateCaseForNewMinuteSheetInteractor(
      {
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: mockTrialSessionId,
      },
      mockTrialClerkUser,
    );

    expect(result).toEqual(
      expect.objectContaining({
        caseCaption: MOCK_CASE.caseCaption,
        docketNumber: MOCK_CASE.docketNumber,
        isLeadCase: false,
      }),
    );
  });

  it('should return consolidated cases information when case is part of a consolidated group', async () => {
    const leadDocketNumber = '100-20';
    const consolidatedCases = [
      {
        ...MOCK_CASE,
        caseCaption: 'Lead Case',
        docketNumber: leadDocketNumber,
        docketNumberSuffix: undefined,
      },
      {
        ...MOCK_CASE,
        caseCaption: 'Member Case 1',
        docketNumber: '101-20',
        docketNumberSuffix: 'S',
      },
    ];

    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      leadDocketNumber,
    });
    getConsolidatedCases.mockResolvedValue(consolidatedCases);

    const result = await validateCaseForNewMinuteSheetInteractor(
      {
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: mockTrialSessionId,
      },
      mockTrialClerkUser,
    );

    expect(result.leadDocketNumber).toBe(leadDocketNumber);
    expect(result.consolidatedCases).toHaveLength(2);
    expect(result.consolidatedCases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: leadDocketNumber,
        }),
        expect.objectContaining({
          docketNumber: '101-20',
          docketNumberWithSuffix: '101-20S',
        }),
      ]),
    );
  });

  it('should format docket number by removing leading zeroes and suffix', async () => {
    await validateCaseForNewMinuteSheetInteractor(
      {
        docketNumber: '00101-18S',
        trialSessionId: mockTrialSessionId,
      },
      mockTrialClerkUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalledWith({
      docketNumber: '101-18',
      includeConsolidatedCases: false,
    });
  });

  it('should allow chambers user to access the interactor', async () => {
    await expect(
      validateCaseForNewMinuteSheetInteractor(
        {
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: mockTrialSessionId,
        },
        mockChambersUser,
      ),
    ).resolves.not.toThrow();
  });

  it('should allow trial clerk to access the interactor', async () => {
    await expect(
      validateCaseForNewMinuteSheetInteractor(
        {
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: mockTrialSessionId,
        },
        mockTrialClerkUser,
      ),
    ).resolves.not.toThrow();
  });

  it('should return isLeadCase as true when case is the lead case', async () => {
    const leadDocketNumber = MOCK_CASE.docketNumber;

    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      leadDocketNumber,
    });

    const result = await validateCaseForNewMinuteSheetInteractor(
      {
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: mockTrialSessionId,
      },
      mockTrialClerkUser,
    );

    expect(result.isLeadCase).toBe(true);
  });

  it('should not fetch consolidated cases when case has no leadDocketNumber', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      leadDocketNumber: undefined,
    });

    const result = await validateCaseForNewMinuteSheetInteractor(
      {
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: mockTrialSessionId,
      },
      mockTrialClerkUser,
    );

    expect(getConsolidatedCases).not.toHaveBeenCalled();
    expect(result.consolidatedCases).toEqual([]);
  });
});
