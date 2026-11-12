import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REGULAR,
} from '@shared/test/mockTrial';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getClerkDashboardTrialSessionsInteractor } from './getClerkDashboardTrialSessionsInteractor';
import { getClerkOfCourtDashboardTrialSessionWeeks } from '@web-api/business/utilities/getClerkOfCourtDashboardTrialSessionWeeks';
import { getTrialSessionsStartingBetween as getTrialSessionsStartingBetweenMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionsStartingBetween';
import {
  mockClerkOfTheCourtUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

jest.mock(
  '@web-api/business/utilities/getClerkOfCourtDashboardTrialSessionWeeks',
  () => ({ getClerkOfCourtDashboardTrialSessionWeeks: jest.fn() }),
);

describe('getClerkDashboardTrialSessionsInteractor', () => {
  const getTrialSessionsStartingBetween = jest.mocked(
    getTrialSessionsStartingBetweenMock,
  );
  const getWeeks = jest.mocked(getClerkOfCourtDashboardTrialSessionWeeks);

  const mockWeeks = {
    currentWeekEnd: '2026-11-08T04:59:59.999Z',
    currentWeekStart: '2026-11-01T04:00:00.000Z',
    nextWeekEnd: '2026-11-15T04:59:59.999Z',
    nextWeekStart: '2026-11-08T05:00:00.000Z',
  };

  beforeEach(() => {
    getWeeks.mockReturnValue(mockWeeks);
    getTrialSessionsStartingBetween.mockResolvedValue([]);
  });

  it('should throw an unauthorized error when the user does not have permission to view trial sessions', async () => {
    await expect(
      getClerkDashboardTrialSessionsInteractor(mockPetitionerUser),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
    expect(getTrialSessionsStartingBetween).not.toHaveBeenCalled();
  });

  it('should get only the trial sessions from the start of the current week to the end of the next week', async () => {
    await getClerkDashboardTrialSessionsInteractor(mockClerkOfTheCourtUser);

    expect(getTrialSessionsStartingBetween).toHaveBeenCalledWith({
      begin: '2026-11-01T04:00:00.000Z',
      end: '2026-11-15T04:59:59.999Z',
    });
  });

  it('should return each trial session as a TrialSessionInfoDTO, with the weeks it used for the query', async () => {
    getTrialSessionsStartingBetween.mockResolvedValue([
      MOCK_TRIAL_INPERSON,
      MOCK_TRIAL_REGULAR,
    ]);

    const result = await getClerkDashboardTrialSessionsInteractor(
      mockClerkOfTheCourtUser,
    );

    expect(result.weeks).toEqual(mockWeeks);
    expect(result.trialSessions).toHaveLength(2);
    result.trialSessions.forEach(trialSession => {
      expect(trialSession instanceof TrialSessionInfoDTO).toBe(true);
    });
  });

  it('should return no trial sessions when the weeks cannot be calculated', async () => {
    getWeeks.mockReturnValue(undefined);

    const result = await getClerkDashboardTrialSessionsInteractor(
      mockClerkOfTheCourtUser,
    );

    expect(result).toEqual({ trialSessions: [] });
    expect(getTrialSessionsStartingBetween).not.toHaveBeenCalled();
  });
});
