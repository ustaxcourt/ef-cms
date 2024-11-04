import { CalendaringConfig } from './createProspectiveTrialSessions';
import { CaseCountsAndSessionsByCity } from './getDataForCalendaring';
import { Constraint } from './constraints';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import { generateCalendar } from './generateCalendar';

const mockRegularCityString = TRIAL_CITY_STRINGS[TRIAL_CITY_STRINGS.length - 1];
const mockWeekString = '3000-03-03';
const mockWeeksToLoop = [mockWeekString];
const mockTrialSession: RawTrialSession = {
  ...MOCK_TRIAL_INPERSON,
  startDate: '3000-03-07T00:00:00.000Z',
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
): CaseCountsAndSessionsByCity => {
  return {
    [mockRegularCityString]: {
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
    const { caseCountsAndSessionsByCity, sessionCountPerWeek } =
      generateCalendar({
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
    expect(sessionCountPerWeek[mockWeekString]).toEqual(1);
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
    const mockRegularTrialSession = {
      ...mockTrialSession,
      sessionType: SESSION_TYPES.regular,
      trialLocation: mockRegularCityString,
    };
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity({
      prospectiveSessions: [mockRegularTrialSession],
    });

    // Act
    const { caseCountsAndSessionsByCity, sessionCountPerWeek } =
      generateCalendar({
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
    expect(sessionCountPerWeek[mockWeekString]).toEqual(1);
  });

  it('should not schedule a regular session when it fails a constraint', () => {
    // Arrange
    const mockRegularTrialSession = {
      ...mockTrialSession,
      sessionType: SESSION_TYPES.regular,
      trialLocation: mockRegularCityString,
    };
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity({
      prospectiveSessions: [mockRegularTrialSession],
    });

    // Act
    const { caseCountsAndSessionsByCity, sessionCountPerWeek } =
      generateCalendar({
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
    expect(sessionCountPerWeek[mockWeekString]).toEqual(0);
  });
});
