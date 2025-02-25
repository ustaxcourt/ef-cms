import * as excelModule from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/writeTrialSessionDataToExcel';
import * as generateCalendarModule from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/generateCalendar';
import {
  CalendaringConfig,
  ScheduledTrialSession,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import { CaseCountsAndSessionsByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import {
  SESSION_TYPES,
  SUGGESTED_TRIAL_SESSION_TITLES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
  generateSuggestedTrialSessionCalendarInteractor,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
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
    expect(message.message).toEqual(SUGGESTED_TRIAL_SESSION_TITLES.success);
    expect(bufferArray).toBeDefined();
    expect(bufferArray?.length).toBeGreaterThan(0);
  });

  it('should pass valid data to the routine that creates the spreadsheet', async () => {
    // Arrange
    const mockStartDate = '2019-08-22T00:00:00.000Z';
    const mockEndDate = '2019-09-22T00:00:00.000Z';
    jest.mock(
      '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/generateCalendar',
    );
    jest.mock(
      '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/writeTrialSessionDataToExcel',
    );
    const generateCalendarSpy = jest.spyOn(
      generateCalendarModule,
      'generateCalendar',
    );
    const writeTrialSessionDataToExcelSpy = jest.spyOn(
      excelModule,
      'writeTrialSessionDataToExcel',
    );

    // Act
    await generateSuggestedTrialSessionCalendarInteractor(
      applicationContext,
      { termEndDate: mockEndDate, termStartDate: mockStartDate },
      mockPetitionsClerkUser,
    );

    // Assert
    expect(writeTrialSessionDataToExcelSpy).toHaveBeenCalled();

    const { caseCountsAndSessionsByCity } =
      writeTrialSessionDataToExcelSpy.mock.calls[0][0];
    const { calendaringConfig } = generateCalendarSpy.mock.calls[0][0];

    expect(allCitiesAreValidTrialCities(caseCountsAndSessionsByCity)).toBe(
      true,
    );
    expect(allTrialCitiesAreIncluded(caseCountsAndSessionsByCity)).toBe(true);
    expect(
      caseCountsAndSessionsByCity[WASHINGTON_DC_SOUTH_STRING],
    ).toBeDefined();
    expect(
      caseCountsAndSessionsByCity[WASHINGTON_DC_NORTH_STRING],
    ).toBeDefined();
    expect(caseCountsAndSessionsByCity[WASHINGTON_DC_STRING]).toBeUndefined();

    expect(
      allSessionsMeetCountPerLocationConstraint(
        caseCountsAndSessionsByCity,
        calendaringConfig,
      ),
    ).toBe(true);

    expect(
      allSessionsMeetCountPerWeekConstraint(
        caseCountsAndSessionsByCity,
        calendaringConfig,
      ),
    ).toBe(true);

    expect(
      countsAndQuantitiesAreValid(
        caseCountsAndSessionsByCity,
        calendaringConfig,
      ),
    ).toBe(true);
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
    expect(message.title).toEqual(SUGGESTED_TRIAL_SESSION_TITLES.invalid);
    expect(bufferArray).toBeUndefined();
  });
});

const allCitiesAreValidTrialCities = (
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
): boolean => {
  const keysWithoutDC = Object.keys(caseCountsAndSessionsByCity).filter(
    cityStateString =>
      cityStateString != WASHINGTON_DC_NORTH_STRING &&
      cityStateString != WASHINGTON_DC_SOUTH_STRING,
  );
  return keysWithoutDC.every(key =>
    TRIAL_CITY_STRINGS.some(
      cityString => key.toLowerCase() === cityString.toLowerCase(),
    ),
  );
};

const allTrialCitiesAreIncluded = (
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
): boolean => {
  return TRIAL_CITY_STRINGS.filter(
    cityStateString => cityStateString !== WASHINGTON_DC_STRING,
  ).every(key =>
    Object.keys(caseCountsAndSessionsByCity).some(
      cityString => key.toLowerCase() === cityString.toLowerCase(),
    ),
  );
};

const allSessionsMeetCountPerLocationConstraint = (
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
  calendaringConfig: CalendaringConfig,
): boolean => {
  const actualSessionCountsPerWeek = Object.values(
    caseCountsAndSessionsByCity,
  ).map(
    caseCountsAndSessions => caseCountsAndSessions.scheduledSessions.length,
  );

  return actualSessionCountsPerWeek.every(
    sessionCount => sessionCount <= calendaringConfig.maxSessionsPerLocation,
  );
};

const allSessionsMeetCountPerWeekConstraint = (
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
  calendaringConfig: CalendaringConfig,
): boolean => {
  const scheduledSessions: ScheduledTrialSession[] = [];
  Object.values(caseCountsAndSessionsByCity).forEach(caseCountsAndSessions => {
    scheduledSessions.push(...caseCountsAndSessions.scheduledSessions);
  });

  const initialSessionCountPerWeek: Record<string, number> = {};
  const sessionCountsPerWeek = scheduledSessions.reduce((acc, session) => {
    if (!acc[session.weekOf]) acc[session.weekOf] = 0;
    acc[session.weekOf]++;
    return acc;
  }, initialSessionCountPerWeek);

  return Object.values(sessionCountsPerWeek).every(
    sessionCount => sessionCount <= calendaringConfig.maxSessionsPerWeek,
  );
};

const countsAndQuantitiesAreValid = (
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
  calendaringConfig: CalendaringConfig,
): boolean => {
  return Object.values(caseCountsAndSessionsByCity).every(
    caseCountsAndSessions => {
      let initialRegularCaseCount = caseCountsAndSessions.initialRegularCases;
      let initialSmallCaseCount = caseCountsAndSessions.initialSmallCases;

      caseCountsAndSessions.scheduledSessions.forEach(session => {
        if (session.sessionType === SESSION_TYPES.regular) {
          initialRegularCaseCount -= calendaringConfig.regularCaseMaxQuantity;
          if (initialRegularCaseCount < 0) initialRegularCaseCount = 0;
        } else if (session.sessionType === SESSION_TYPES.small) {
          initialSmallCaseCount -= calendaringConfig.smallCaseMaxQuantity;
          if (initialSmallCaseCount < 0) initialSmallCaseCount = 0;
        } else if (session.sessionType === SESSION_TYPES.hybrid) {
          initialRegularCaseCount = 0;
          initialSmallCaseCount = 0;
        }
      });

      return (
        initialRegularCaseCount ===
          caseCountsAndSessions.remainingRegularCases &&
        initialSmallCaseCount === caseCountsAndSessions.remainingSmallCases
      );
    },
  );
};
