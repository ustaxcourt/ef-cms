import { SUGGESTED_TRIAL_SESSION_MESSAGES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateSuggestedTrialSessionCalendarInteractor } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import mockCases from '@shared/test/mockReadyForTrialCases.json';
import mockSpecialSessions from '@shared/test/mockTrialSessions.json';

describe('generateSuggestedTrialSessionCalendar', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getSuggestedCalendarCases.mockResolvedValue(mockCases);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue(mockSpecialSessions);
  });

  it('should generate a trial term when valid date range is provided and sufficient data is present in the system', async () => {
    const mockStartDate = '2019-08-22T00:00:00.000Z';
    const mockEndDate = '2019-09-22T00:00:00.000Z';

    const { bufferArray, message } =
      await generateSuggestedTrialSessionCalendarInteractor(
        applicationContext,
        { termEndDate: mockEndDate, termStartDate: mockStartDate },
        mockPetitionsClerkUser,
      );

    expect(message.startsWith(SUGGESTED_TRIAL_SESSION_MESSAGES.success)).toBe(
      true,
    );
    expect(bufferArray).toBeDefined();
    expect(bufferArray?.length).toBeGreaterThan(0);
  });
});
