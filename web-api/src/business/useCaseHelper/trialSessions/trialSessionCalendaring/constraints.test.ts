import { CalendarState } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/generateCalendar';
import {
  CalendaringConfig,
  ScheduledTrialSession,
} from './createProspectiveTrialSessions';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import {
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import {
  checkConstraints,
  maxSessionsPerLocationConstraint,
  maxSessionsPerWeekConstraint,
  oneSessionPerLocationPerWeekConstraint,
  reservedWeekOfAtLocationConstraint,
  washingtonDcSpecialConstraint,
} from './constraints';

const mockRegularCityString = TRIAL_CITY_STRINGS[TRIAL_CITY_STRINGS.length - 1];
const mockWeekString = '01/12';

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

const getMockCalendarState = (overrides = {}): CalendarState => {
  return {
    reservedWeekOfLocationIntersection: {},
    sessionCountPerCity: {
      [mockRegularCityString]: 0,
    },
    sessionCountPerWeek: {
      [mockWeekString]: 0,
    },
    sessionScheduledPerCityPerWeek: {
      [mockWeekString]: new Set(),
    },
    ...overrides,
  };
};

describe('constraints', () => {
  describe('checkConstraints', () => {
    it('should return true when a regular session meets the provided constraints', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionCountPerWeek: {
          [mockWeekString]: 5,
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = checkConstraints({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        constraints: [maxSessionsPerWeekConstraint],
        scheduledTrialSession: mockSession,
      });

      // Assert
      expect(result).toEqual([true]);
    });

    it('should return false when a regular session does not meet the provided constraints', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionCountPerWeek: {
          [mockWeekString]: 7,
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = checkConstraints({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        constraints: [maxSessionsPerWeekConstraint],
        scheduledTrialSession: mockSession,
      });

      // Assert
      expect(result).toEqual([false]);
    });
  });

  describe('maxSessionsPerWeekConstraint', () => {
    it('should return true when a regular session meets the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionCountPerWeek: {
          [mockWeekString]: 5,
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = maxSessionsPerWeekConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when a regular session does not meet the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionCountPerWeek: {
          [mockWeekString]: 7,
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = maxSessionsPerWeekConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toBe(false);
    });

    it('should return a message when a special session does not meet the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionCountPerWeek: {
          [mockWeekString]: 7,
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.special,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };
      const dateString = formatDateString(mockSession.weekOf, FORMATS.MD);

      // Act
      const result = maxSessionsPerWeekConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toEqual(
        `More special sessions than maximum allowed per week: ${dateString} \n`,
      );
    });
  });

  describe('maxSessionsPerLocationConstraint', () => {
    it('should return true when a regular session meets the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionCountPerCity: {
          [mockRegularCityString]: 4,
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = maxSessionsPerLocationConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when a regular session does not meet the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionCountPerCity: {
          [mockRegularCityString]: 6,
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = maxSessionsPerLocationConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toBe(false);
    });

    it('should return a message when a special session does not meet the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionCountPerCity: {
          [mockRegularCityString]: 6,
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.special,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = maxSessionsPerLocationConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toEqual(
        `More special sessions than maximum allowed per location scheduled: ${mockSession.trialLocation}. \n`,
      );
    });
  });

  describe('oneSessionPerLocationPerWeekConstraint', () => {
    it('should return true when a regular session meets the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionScheduledPerCityPerWeek: {
          [mockWeekString]: new Set(),
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = oneSessionPerLocationPerWeekConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when a regular session does not meet the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionScheduledPerCityPerWeek: {
          [mockWeekString]: new Set([mockRegularCityString]),
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = oneSessionPerLocationPerWeekConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toBe(false);
    });

    it('should return a message when a special session does not meet the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        sessionScheduledPerCityPerWeek: {
          [mockWeekString]: new Set([mockRegularCityString]),
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.special,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };
      const dateString = formatDateString(mockSession.weekOf, FORMATS.MD);

      // Act
      const result = oneSessionPerLocationPerWeekConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toEqual(
        `More than one special trial per week scheduled: ${mockSession.trialLocation}, ${dateString}. \n`,
      );
    });
  });

  describe('reservedWeekOfAtLocationConstraint', () => {
    it('should return true when a regular session meets the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        reservedWeekOfLocationIntersection: {
          [mockWeekString]: [],
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = reservedWeekOfAtLocationConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when a regular session does not meet the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState({
        reservedWeekOfLocationIntersection: {
          [mockWeekString]: [mockRegularCityString],
        },
      });
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = reservedWeekOfAtLocationConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('washingtonDcSpecialConstraint', () => {
    it('should return true when a regular session meets the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState();
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.regular,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = washingtonDcSpecialConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when a special session meets the constraint', () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();
      const mockCalendarState = getMockCalendarState();
      const mockSession: ScheduledTrialSession = {
        sessionType: SESSION_TYPES.special,
        trialLocation: mockRegularCityString,
        weekOf: mockWeekString,
      };

      // Act
      const result = washingtonDcSpecialConstraint({
        calendarState: mockCalendarState,
        calendaringConfig: mockCalendaringConfig,
        session: mockSession,
      });

      // Assert
      expect(result).toBe(true);
    });

    it(
      'should return a message when a special session does not meet the ' +
        'constraint for the maximum number of special sessions in Washington, ' +
        'DC South',
      () => {
        // Arrange
        const mockCalendaringConfig = getMockCalendaringConfig();
        const mockCalendarState = getMockCalendarState({
          sessionCountPerCity: {
            [WASHINGTON_DC_SOUTH_STRING]: 6,
          },
        });
        const mockSession: ScheduledTrialSession = {
          sessionType: SESSION_TYPES.special,
          trialLocation: WASHINGTON_DC_SOUTH_STRING,
          weekOf: mockWeekString,
        };

        // Act
        const result = washingtonDcSpecialConstraint({
          calendarState: mockCalendarState,
          calendaringConfig: mockCalendaringConfig,
          session: mockSession,
        });

        // Assert
        expect(result).toEqual(
          `More special sessions than maximum allowed per location scheduled: ${WASHINGTON_DC_STRING}. \n`,
        );
      },
    );

    it(
      'should return a message when there are already two special sessions ' +
        'scheduled for the same week in Washington, DC',
      () => {
        // Arrange
        const mockCalendaringConfig = getMockCalendaringConfig();
        const mockCalendarState = getMockCalendarState({
          sessionScheduledPerCityPerWeek: {
            [mockWeekString]: new Set([WASHINGTON_DC_SOUTH_STRING]),
          },
        });
        const mockSession: ScheduledTrialSession = {
          sessionType: SESSION_TYPES.special,
          trialLocation: WASHINGTON_DC_SOUTH_STRING,
          weekOf: mockWeekString,
        };
        const dateString = formatDateString(mockSession.weekOf, FORMATS.MD);

        // Act
        const result = washingtonDcSpecialConstraint({
          calendarState: mockCalendarState,
          calendaringConfig: mockCalendaringConfig,
          session: mockSession,
        });

        // Assert
        expect(result).toEqual(
          `More than two special trial sessions per week: ${WASHINGTON_DC_STRING} ${dateString}. \n`,
        );
      },
    );
  });
});
