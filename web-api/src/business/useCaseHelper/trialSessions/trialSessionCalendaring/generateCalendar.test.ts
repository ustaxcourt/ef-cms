import { CalendaringConfig } from './createProspectiveTrialSessions';
import { CaseCountsAndSessionsByCity } from './getDataForCalendaring';
import { Constraint } from './constraints';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { cloneDeep } from 'lodash';
import { generateCalendar } from './generateCalendar';
import {
  getBusinessDateInFuture,
  FORMATS,
  createISODateString,
} from '@shared/business/utilities/DateHandler';

const mockRegularCityString = TRIAL_CITY_STRINGS[TRIAL_CITY_STRINGS.length - 1];
const mockSpecialCityString = TRIAL_CITY_STRINGS[0];
const mockWeekString = getBusinessDateInFuture({
  numberOfDays: 30,
  outputFormat: FORMATS.YYYYMMDD,
  startDate: createISODateString(),
});
const mockWeeksToLoop = [mockWeekString];
const mockTrialSession: RawTrialSession = {
  ...MOCK_TRIAL_INPERSON,
  startDate: createISODateString(mockWeekString, FORMATS.YYYYMMDD),
};
const mockErrorMessage = 'Mocked error';

const getMockCalendaringConfig = (overrides = {}): CalendaringConfig => ({
  hybridCaseMaxQuantity: 10,
  hybridCaseMinimumQuantity: 5,
  maxSessionsPerLocation: 5,
  maxSessionsPerWeek: 6,
  regularCaseMaxQuantity: 10,
  regularCaseMinimumQuantity: 4,
  smallCaseMaxQuantity: 13,
  smallCaseMinimumQuantity: 4,
  ...overrides,
});

const getMockCaseCountsAndSessionsByCity = (
  overrides = {},
  city = mockRegularCityString,
): CaseCountsAndSessionsByCity => {
  return {
    [city]: {
      initialRegularCases: 0,
      initialSmallCases: 0,
      prospectiveSessions: [],
      remainingRegularCases: 0,
      remainingSmallCases: 0,
      scheduledSessions: [],
      ...overrides,
    },
  };
};

const createMockConstraint = (
  shouldPass: boolean,
  shouldError: boolean = false,
): Constraint =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jest.fn(({ calendaringConfig, calendarState, session }) => {
    if (shouldError) {
      throw new Error(mockErrorMessage);
    }
    return shouldPass;
  });

describe('generateCalendar', () => {
  it('should schedule a special session when it meets all constraints', () => {
    console.log('mockWeekString', mockWeekString);
    console.log('mockTrialSession', mockTrialSession);

    // Arrange
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity =
      getMockCaseCountsAndSessionsByCity();
    const mockSpecialTrialSession = {
      ...mockTrialSession,
      sessionType: SESSION_TYPES.special,
      trialLocation: mockRegularCityString,
    };

    // Act
    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [mockSpecialTrialSession],
      weeksToLoop: mockWeeksToLoop,
    });

    // Assert
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].scheduledSessions
        .length,
    ).toEqual(1);
  });

  it('should not schedule a special session when it fails a constraint', () => {
    // Arrange
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity =
      getMockCaseCountsAndSessionsByCity();
    const mockSpecialTrialSession = {
      ...mockTrialSession,
      sessionType: SESSION_TYPES.special,
      trialLocation: mockRegularCityString,
    };

    // Act and Assert
    expect(() =>
      generateCalendar({
        calendaringConfig: mockCalendaringConfig,
        caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
        constraints: [createMockConstraint(false, true)],
        specialSessions: [mockSpecialTrialSession],
        weeksToLoop: mockWeeksToLoop,
      }),
    ).toThrow(mockErrorMessage);
  });

  it('should schedule a regular session when it meets all constraints', () => {
    // Arrange
    const mockProspectiveRegularTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.regular,
      trialLocation: mockRegularCityString,
    };
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity({
      prospectiveSessions: [mockProspectiveRegularTrialSession],
    });

    // Act
    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: mockWeeksToLoop,
    });

    // Assert
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].scheduledSessions
        .length,
    ).toEqual(1);
  });

  it('should not schedule a regular session when it fails a constraint', () => {
    // Arrange
    const mockProspectiveRegularTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.regular,
      trialLocation: mockRegularCityString,
    };
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity({
      prospectiveSessions: [mockProspectiveRegularTrialSession],
    });

    // Act
    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(false)],
      specialSessions: [],
      weeksToLoop: mockWeeksToLoop,
    });

    // Assert
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].scheduledSessions
        .length,
    ).toEqual(0);
  });

  it('should prioritize cities that have not been visited in the past two terms', () => {
    // Arrange
    const mockProspectiveRegularTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.regular,
      trialLocation: mockRegularCityString,
    };
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity({
      prospectiveSessions: [mockProspectiveRegularTrialSession],
    });

    const mockCityNotVisitedLastTwoTerms = 'mock city, usa';
    const mockSecondWeek = getBusinessDateInFuture({
      numberOfDays: 37,
      outputFormat: FORMATS.YYYYMMDD,
      startDate: createISODateString(),
    });
    const mockProspectiveRegularTrialSessionNotVisitedLastTwoTerms = {
      cityWasNotVisitedInLastTwoTerms: true,
      sessionType: SESSION_TYPES.regular,
      trialLocation: mockCityNotVisitedLastTwoTerms,
    };
    mockCaseCountsAndSessionsByCity[mockCityNotVisitedLastTwoTerms] = {
      initialRegularCases: 0,
      initialSmallCases: 0,
      prospectiveSessions: [
        mockProspectiveRegularTrialSessionNotVisitedLastTwoTerms,
      ],
      remainingRegularCases: 0,
      remainingSmallCases: 0,
      scheduledSessions: [],
    };

    // Act
    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: [...mockWeeksToLoop, mockSecondWeek],
    });

    // Assert
    expect(Object.keys(caseCountsAndSessionsByCity)[0]).toEqual(
      mockCityNotVisitedLastTwoTerms,
    );
    expect(Object.keys(caseCountsAndSessionsByCity)[1]).toEqual(
      mockRegularCityString,
    );
  });

  it('should keep count of scheduled trial sessions for regular cases', () => {
    // Arrange
    const mockProspectiveRegularTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.regular,
      trialLocation: mockRegularCityString,
    };
    const mockProspectiveSmallTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.regular,
      trialLocation: mockRegularCityString,
    };
    const mockCalendaringConfig = getMockCalendaringConfig({
      regularCaseMaxQuantity: 1,
    });
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity({
      initialRegularCases: 1,
      initialSmallCases: 0,
      prospectiveSessions: [
        mockProspectiveRegularTrialSession,
        mockProspectiveSmallTrialSession,
      ],
      remainingRegularCases: 1,

      remainingSmallCases: 0,
    });
    const mockSecondWeek = getBusinessDateInFuture({
      numberOfDays: 37,
      outputFormat: FORMATS.YYYYMMDD,
      startDate: createISODateString(),
    });

    // Act
    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: [...mockWeeksToLoop, mockSecondWeek],
    });

    // Assert
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].remainingRegularCases,
    ).toEqual(0);
  });

  it('should keep count of scheduled trial sessions for small cases', () => {
    // Arrange
    const mockProspectiveRegularTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.small,
      trialLocation: mockSpecialCityString,
    };
    const mockProspectiveSmallTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.small,
      trialLocation: mockSpecialCityString,
    };
    const mockCalendaringConfig = getMockCalendaringConfig({
      smallCaseMaxQuantity: 1,
    });
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity(
      {
        initialRegularCases: 0,
        initialSmallCases: 1,
        prospectiveSessions: [
          mockProspectiveRegularTrialSession,
          mockProspectiveSmallTrialSession,
        ],
        remainingRegularCases: 0,
        remainingSmallCases: 1,
      },
      mockSpecialCityString,
    );
    const mockSecondWeek = getBusinessDateInFuture({
      numberOfDays: 37,
      outputFormat: FORMATS.YYYYMMDD,
      startDate: createISODateString(),
    });

    // Act
    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: [...mockWeeksToLoop, mockSecondWeek],
    });

    // Assert
    expect(
      caseCountsAndSessionsByCity[mockSpecialCityString].remainingSmallCases,
    ).toEqual(0);
  });

  it('should handle case counts for hybrid sessions', () => {
    // Arrange
    const mockProspectiveRegularTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.hybrid,
      trialLocation: mockRegularCityString,
    };
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity({
      initialRegularCases: 1,
      initialSmallCases: 1,
      prospectiveSessions: [mockProspectiveRegularTrialSession],
      remainingRegularCases: 1,
      remainingSmallCases: 1,
    });
    const mockSecondWeek = getBusinessDateInFuture({
      numberOfDays: 37,
      outputFormat: FORMATS.YYYYMMDD,
      startDate: createISODateString(),
    });

    // Act
    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: [...mockWeeksToLoop, mockSecondWeek],
    });

    // Assert
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].remainingRegularCases,
    ).toEqual(0);
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].remainingSmallCases,
    ).toEqual(0);
  });

  it('should decrement from the larger count (of small and regular cases) first if leftover remains for hybrid sessions', () => {
    // Arrange
    const mockProspectiveHybridTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.hybrid,
      trialLocation: mockRegularCityString,
    };

    const mockCalendaringConfig = getMockCalendaringConfig({
      hybridCaseMaxQuantity: 12,
    });

    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity({
      initialRegularCases: 10,
      initialSmallCases: 3,
      prospectiveSessions: [mockProspectiveHybridTrialSession],
      remainingRegularCases: 10,
      remainingSmallCases: 3,
    });

    const mockSecondWeek = getBusinessDateInFuture({
      numberOfDays: 37,
      outputFormat: FORMATS.YYYYMMDD,
      startDate: createISODateString(),
    });

    // Act
    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: [...mockWeeksToLoop, mockSecondWeek],
    });

    // Assert
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].remainingRegularCases,
    ).toEqual(0);
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].remainingSmallCases,
    ).toEqual(1);
  });

  it('should use the correct trial location for special sessions when Washington DC, North is available', () => {
    // Arrange
    const mockCalendaringConfig = getMockCalendaringConfig({
      maxSessionsPerLocationConstraint: 1,
    });
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity(
      {},
      WASHINGTON_DC_NORTH_STRING,
    );
    const mockSpecialTrialSession = {
      ...mockTrialSession,
      sessionType: SESSION_TYPES.special,
      trialLocation: WASHINGTON_DC_STRING,
    };

    // Act
    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [mockSpecialTrialSession],
      weeksToLoop: mockWeeksToLoop,
    });

    // Assert
    expect(
      caseCountsAndSessionsByCity[WASHINGTON_DC_NORTH_STRING]
        .scheduledSessions[0].trialLocation,
    ).toEqual(WASHINGTON_DC_NORTH_STRING);
  });

  it('should use the correct trial location for special sessions when Washington DC, North is not available', () => {
    // Arrange
    const mockCalendaringConfig = getMockCalendaringConfig({
      maxSessionsPerLocation: 1,
    });
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity(
      {},
      WASHINGTON_DC_NORTH_STRING,
    );
    mockCaseCountsAndSessionsByCity[WASHINGTON_DC_SOUTH_STRING] = {
      initialRegularCases: 1,
      initialSmallCases: 1,
      prospectiveSessions: [],
      remainingRegularCases: 1,
      remainingSmallCases: 1,
      scheduledSessions: [],
    };
    const mockSpecialTrialSession = {
      ...mockTrialSession,
      sessionType: SESSION_TYPES.special,
      trialLocation: WASHINGTON_DC_STRING,
    };

    // Act
    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: Array.from({ length: 2 }, () =>
        cloneDeep(mockSpecialTrialSession),
      ),
      weeksToLoop: mockWeeksToLoop,
    });

    // Assert
    expect(
      caseCountsAndSessionsByCity[WASHINGTON_DC_SOUTH_STRING]
        .scheduledSessions[0].trialLocation,
    ).toEqual(WASHINGTON_DC_SOUTH_STRING);
  });
});
