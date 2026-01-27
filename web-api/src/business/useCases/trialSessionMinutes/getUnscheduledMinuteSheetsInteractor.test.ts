import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/minuteSheets/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  mockPetitionerUser,
  mockTrialClerkUser,
} from '@shared/test/mockAuthUsers';
import { getUnscheduledMinuteSheetsInteractor } from './getUnscheduledMinuteSheetsInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getMinuteSheetsByTrialSession as getMinuteSheetsByTrialSessionMock } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheetsByTrialSession';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

describe('getUnscheduledMinuteSheetsInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const getMinuteSheetsByTrialSession = jest.mocked(
    getMinuteSheetsByTrialSessionMock,
  );

  const mockTrialSessionId = MOCK_TRIAL_REGULAR.trialSessionId!;

  beforeEach(() => {
    jest.clearAllMocks();
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [],
    });
    getMinuteSheetsByTrialSession.mockResolvedValue([]);
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  it('should throw UnauthorizedError when user does not have MANAGE_MINUTE_SHEET permission', async () => {
    await expect(
      getUnscheduledMinuteSheetsInteractor(
        { trialSessionId: mockTrialSessionId },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw NotFoundError when trial session does not exist', async () => {
    getTrialSessionById.mockResolvedValue(undefined);

    await expect(
      getUnscheduledMinuteSheetsInteractor(
        { trialSessionId: 'non-existent-session' },
        mockTrialClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('should return empty array when no minute sheets exist', async () => {
    getMinuteSheetsByTrialSession.mockResolvedValue([]);

    const result = await getUnscheduledMinuteSheetsInteractor(
      { trialSessionId: mockTrialSessionId },
      mockTrialClerkUser,
    );

    expect(result).toEqual([]);
  });

  it('should return unscheduled minute sheets (cases NOT on trial session calendar)', async () => {
    const unscheduledDocketNumber = '200-20';

    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [
        {
          docketNumber: '100-20',
          isHearing: false,
          isManuallyAdded: false,
          removedFromTrial: false,
        },
      ],
    });

    getMinuteSheetsByTrialSession.mockResolvedValue([
      { docketNumber: '100-20', trialSessionId: mockTrialSessionId, content: {} as any },
      { docketNumber: unscheduledDocketNumber, trialSessionId: mockTrialSessionId, content: {} as any },
    ]);

    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      caseCaption: 'Unscheduled Case Caption',
      docketNumber: unscheduledDocketNumber,
      docketNumberSuffix: 'S',
    });

    const result = await getUnscheduledMinuteSheetsInteractor(
      { trialSessionId: mockTrialSessionId },
      mockTrialClerkUser,
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      caseCaption: 'Unscheduled Case Caption',
      docketNumber: unscheduledDocketNumber,
      docketNumberWithSuffix: '200-20S',
    });
  });

  it('should filter out cases that no longer exist', async () => {
    getMinuteSheetsByTrialSession.mockResolvedValue([
      { docketNumber: '100-20', trialSessionId: mockTrialSessionId, content: {} as any },
      { docketNumber: '200-20', trialSessionId: mockTrialSessionId, content: {} as any },
    ]);

    getCaseByDocketNumber
      .mockResolvedValueOnce({
        ...MOCK_CASE,
        docketNumber: '100-20',
      })
      .mockResolvedValueOnce(undefined as any);

    const result = await getUnscheduledMinuteSheetsInteractor(
      { trialSessionId: mockTrialSessionId },
      mockTrialClerkUser,
    );

    expect(result).toHaveLength(1);
    expect(result[0].docketNumber).toBe('100-20');
  });

  it('should return empty array when all minute sheets are for scheduled cases', async () => {
    const scheduledDocketNumber = '100-20';

    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [
        {
          docketNumber: scheduledDocketNumber,
          isHearing: false,
          isManuallyAdded: false,
          removedFromTrial: false,
        },
      ],
    });

    getMinuteSheetsByTrialSession.mockResolvedValue([
      { docketNumber: scheduledDocketNumber, trialSessionId: mockTrialSessionId, content: {} as any },
    ]);

    const result = await getUnscheduledMinuteSheetsInteractor(
      { trialSessionId: mockTrialSessionId },
      mockTrialClerkUser,
    );

    expect(result).toEqual([]);
  });
});
