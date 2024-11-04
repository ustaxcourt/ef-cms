import { SUGGESTED_TRIAL_SESSION_MESSAGES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateSuggestedTrialSessionCalendarInteractor } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import {
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import mockCases from '@shared/test/mockReadyForTrialCases.json';
import mockSpecialSessions from '@shared/test/mockTrialSessions.json';
import * as excelFn from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/writeTrialSessionDataToExcel';

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
    // Arrange
    const mockStartDate = '2019-08-22T00:00:00.000Z';
    const mockEndDate = '2019-09-22T00:00:00.000Z';

    // Act
    const { bufferArray, message } =
      await generateSuggestedTrialSessionCalendarInteractor(
        applicationContext,
        { termEndDate: mockEndDate, termStartDate: mockStartDate },
        mockPetitionsClerkUser,
      );

    // Assert
    expect(message.startsWith(SUGGESTED_TRIAL_SESSION_MESSAGES.success)).toBe(
      true,
    );
    expect(bufferArray).toBeDefined();
    expect(bufferArray?.length).toBeGreaterThan(0);
  });

  it('should pass valid data to the routine that creates the spreadsheet', async () => {
    // Arrange
    const mockStartDate = '2019-08-22T00:00:00.000Z';
    const mockEndDate = '2019-09-22T00:00:00.000Z';
    jest.mock(
      '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/writeTrialSessionDataToExcel',
    );
    const writeTrialSessionDataToExcelSpy = jest.spyOn(
      excelFn,
      'writeTrialSessionDataToExcel',
    );

    // Act
    const { bufferArray, message } =
      await generateSuggestedTrialSessionCalendarInteractor(
        applicationContext,
        { termEndDate: mockEndDate, termStartDate: mockStartDate },
        mockPetitionsClerkUser,
      );

    // Assert
    expect(writeTrialSessionDataToExcelSpy).toHaveBeenCalled();

    const [argumentsPassed] = writeTrialSessionDataToExcelSpy.mock.calls;
    const { caseCountsAndSessionsByCity, sessionCountPerWeek, weeks } =
      argumentsPassed[0];

    // 10275 TODO: how to appropriately assert that the caseCountsAndSessionsByCity,
    // sessionCountPerWeek, and weeks arguments passed to writeTrialSessionDataToExcel
    // are valid.
    console.log(JSON.stringify(caseCountsAndSessionsByCity, null, 2));
  });

  it('should not generate a trial term for a user without the necessary permissions', async () => {
    // Arrange
    const mockStartDate = '2019-08-22T00:00:00.000Z';
    const mockEndDate = '2019-09-22T00:00:00.000Z';

    // Act and Assert
    await expect(async () => {
      await generateSuggestedTrialSessionCalendarInteractor(
        applicationContext,
        { termEndDate: mockEndDate, termStartDate: mockStartDate },
        mockPrivatePractitionerUser,
      );
    }).rejects.toThrow('Unauthorized to generate term');
  });

  it('should return an error message if there is no calendar data', async () => {
    // Arrange
    const mockStartDate = '2019-08-22T00:00:00.000Z';
    const mockEndDate = '2019-09-22T00:00:00.000Z';
    applicationContext
      .getPersistenceGateway()
      .getSuggestedCalendarCases.mockResolvedValue([]);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue([]);

    // Act
    const { bufferArray, message } =
      await generateSuggestedTrialSessionCalendarInteractor(
        applicationContext,
        { termEndDate: mockEndDate, termStartDate: mockStartDate },
        mockPetitionsClerkUser,
      );

    // Assert
    expect(message.startsWith(SUGGESTED_TRIAL_SESSION_MESSAGES.invalid)).toBe(
      true,
    );
    expect(bufferArray).toBeUndefined();
  });
});
