import {
  SUGGESTED_TRIAL_SESSION_MESSAGES,
  generateSuggestedTrialSessionCalendarInteractor,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import mockCases from '@shared/test/mockCasesReadyForTrial.json';

describe('generateSuggestedTrialSessionCalendar', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getReadyForTrialCases.mockResolvedValue(mockCases);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue([]);
  });

  it('should generate a trial term when valid date range is provided and sufficient data is present in the system', async () => {
    const mockStartDate = '08/22/2019';
    const mockEndDate = '09/22/2019';

    const { bufferArray, message } =
      await generateSuggestedTrialSessionCalendarInteractor(
        applicationContext,
        { termEndDate: mockEndDate, termStartDate: mockStartDate },
        mockPetitionsClerkUser,
      );

    expect(message).toEqual(SUGGESTED_TRIAL_SESSION_MESSAGES.success);
    expect(bufferArray).toBeDefined();
  });
});
