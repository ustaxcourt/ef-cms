import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateSuggestedTrialSessionCalendarInteractor } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
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
    // const mockStartDate = '2019-08-22T04:00:00.000Z';
    // const mockEndDate = '2019-09-22T04:00:00.000Z';
    const mockStartDate = '08/22/2019';
    const mockEndDate = '09/22/2019';

    const { bufferArray, message } =
      await generateSuggestedTrialSessionCalendarInteractor(
        applicationContext,
        { termEndDate: mockEndDate, termStartDate: mockStartDate },
        mockPetitionsClerkUser,
      );

    expect(message).toEqual('Trial session calendar generated');
    expect(bufferArray).toBeDefined();
  });
});
