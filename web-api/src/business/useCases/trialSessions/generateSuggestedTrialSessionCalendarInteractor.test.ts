import { MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING } from '@shared/test/mockCase';
import {
  PROCEDURE_TYPES_MAP,
  TRIAL_CITY_STRINGS,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateSuggestedTrialSessionCalendarInteractor } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';

describe('generateSuggestedTrialSessionCalendar', () => {
  // REGULAR_CASE_MINIMUM_QUANTITY + 1
  const totalNumberOfMockCases = 40 + 1;

  const mockRegularCityString =
    TRIAL_CITY_STRINGS[TRIAL_CITY_STRINGS.length - 1];

  const mockCases: RawCase[] = [];
  for (let i = 0; i < totalNumberOfMockCases; ++i) {
    mockCases.push({
      ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
      docketNumber: `10${i}-24`,
      preferredTrialCity: mockRegularCityString,
      procedureType: PROCEDURE_TYPES_MAP.regular,
    });
  }

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
