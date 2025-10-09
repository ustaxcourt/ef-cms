import { CalendaringConfig } from './createProspectiveTrialSessions';
import { CaseCountsAndSessionsByCity } from './getDataForCalendaring';
import {
  Constraint,
  oneSessionPerLocationPerWeekConstraint,
  reservedWeekOfAtLocationConstraint,
} from './constraints';
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
  createDateAtStartOfWeekEST,
  getWeeksInRange,
  IsoDateRange,
} from '@shared/business/utilities/DateHandler';

const mockRegularCityString = TRIAL_CITY_STRINGS[TRIAL_CITY_STRINGS.length - 1];
const mockSpecialCityString = TRIAL_CITY_STRINGS[0];

const mockBusinessDateStart = getBusinessDateInFuture({
  numberOfDays: 30,
  outputFormat: FORMATS.YYYYMMDD,
  startDate: createISODateString(),
});

const mockBusinessDateEnd = getBusinessDateInFuture({
  numberOfDays: 35,
  outputFormat: FORMATS.YYYYMMDD,
  startDate: createISODateString(),
});

const mockWeekStringStart = createDateAtStartOfWeekEST(
  mockBusinessDateStart,
  FORMATS.YYYYMMDD,
);

const mockWeekStringEnd = createDateAtStartOfWeekEST(
  mockBusinessDateEnd,
  FORMATS.YYYYMMDD,
);

const mockWeek = { start: mockWeekStringStart, end: mockWeekStringEnd };

const mockSecondWeekStart = getBusinessDateInFuture({
  numberOfDays: 37,
  outputFormat: FORMATS.YYYYMMDD,
  startDate: createISODateString(),
});

const mockSecondWeekEnd = getBusinessDateInFuture({
  numberOfDays: 42,
  outputFormat: FORMATS.YYYYMMDD,
  startDate: createISODateString(),
});

const mockSecondWeek = {
  start: mockSecondWeekStart,
  end: mockSecondWeekEnd,
};

const mockWeeksToLoop = [mockWeek];
const mockTrialSession: RawTrialSession = {
  ...MOCK_TRIAL_INPERSON,
  startDate: createISODateString(mockWeek.start, FORMATS.YYYYMMDD),
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
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity =
      getMockCaseCountsAndSessionsByCity();
    const mockSpecialTrialSession = {
      ...mockTrialSession,
      sessionType: SESSION_TYPES.special,
      trialLocation: mockRegularCityString,
    };

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [mockSpecialTrialSession],
      weeksToLoop: mockWeeksToLoop,
    });

    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].scheduledSessions
        .length,
    ).toEqual(1);
  });

  it('should not schedule a special session when it fails a constraint', () => {
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity =
      getMockCaseCountsAndSessionsByCity();
    const mockSpecialTrialSession = {
      ...mockTrialSession,
      sessionType: SESSION_TYPES.special,
      trialLocation: mockRegularCityString,
    };

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
    const mockProspectiveRegularTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.regular,
      trialLocation: mockRegularCityString,
    };
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity({
      prospectiveSessions: [mockProspectiveRegularTrialSession],
    });

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: mockWeeksToLoop,
    });

    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].scheduledSessions
        .length,
    ).toEqual(1);
  });

  it('should not schedule a regular session when it fails a constraint', () => {
    const mockProspectiveRegularTrialSession = {
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.regular,
      trialLocation: mockRegularCityString,
    };
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity = getMockCaseCountsAndSessionsByCity({
      prospectiveSessions: [mockProspectiveRegularTrialSession],
    });

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(false)],
      specialSessions: [],
      weeksToLoop: mockWeeksToLoop,
    });

    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].scheduledSessions
        .length,
    ).toEqual(0);
  });

  it('should prioritize cities that have not been visited in the past two terms', () => {
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

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: [...mockWeeksToLoop, mockSecondWeek],
    });

    expect(Object.keys(caseCountsAndSessionsByCity)[0]).toEqual(
      mockCityNotVisitedLastTwoTerms,
    );
    expect(Object.keys(caseCountsAndSessionsByCity)[1]).toEqual(
      mockRegularCityString,
    );
  });

  it('should keep count of scheduled trial sessions for regular cases', () => {
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

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: [...mockWeeksToLoop, mockSecondWeek],
    });

    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].remainingRegularCases,
    ).toEqual(0);
  });

  it('should keep count of scheduled trial sessions for small cases', () => {
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

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: [...mockWeeksToLoop, mockSecondWeek],
    });

    expect(
      caseCountsAndSessionsByCity[mockSpecialCityString].remainingSmallCases,
    ).toEqual(0);
  });

  it('should handle case counts for hybrid sessions', () => {
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

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: [...mockWeeksToLoop, mockSecondWeek],
    });

    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].remainingRegularCases,
    ).toEqual(0);
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].remainingSmallCases,
    ).toEqual(0);
  });

  it('should decrement from the larger count (of small and regular cases) first if leftover remains for hybrid sessions', () => {
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

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [],
      weeksToLoop: [...mockWeeksToLoop, mockSecondWeek],
    });

    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].remainingRegularCases,
    ).toEqual(0);
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].remainingSmallCases,
    ).toEqual(1);
  });

  it('should use the correct trial location for special sessions when Washington DC, North is available', () => {
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

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [mockSpecialTrialSession],
      weeksToLoop: mockWeeksToLoop,
    });

    expect(
      caseCountsAndSessionsByCity[WASHINGTON_DC_NORTH_STRING]
        .scheduledSessions[0].trialLocation,
    ).toEqual(WASHINGTON_DC_NORTH_STRING);
  });

  it('should use the correct trial location for special sessions when Washington DC, North is not available', () => {
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

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: Array.from({ length: 2 }, () =>
        cloneDeep(mockSpecialTrialSession),
      ),
      weeksToLoop: mockWeeksToLoop,
    });

    expect(
      caseCountsAndSessionsByCity[WASHINGTON_DC_SOUTH_STRING]
        .scheduledSessions[0].trialLocation,
    ).toEqual(WASHINGTON_DC_SOUTH_STRING);
  });

  it('should extend special sessions when end date present', () => {
    const mockCalendaringConfig = getMockCalendaringConfig();
    const mockCaseCountsAndSessionsByCity =
      getMockCaseCountsAndSessionsByCity();

    const startDate = createISODateString(
      mockWeekStringStart,
      FORMATS.YYYYMMDD,
    );
    const estimatedEndDate = getBusinessDateInFuture({
      numberOfDays: 14,
      outputFormat: FORMATS.YYYYMMDD,
      startDate,
    });

    const additionalWeeks = getWeeksInRange({
      startDate,
      endDate: estimatedEndDate,
    });

    const allWeeksToLoop = [...mockWeeksToLoop, ...additionalWeeks];

    const mockSpecialTrialSession = {
      ...mockTrialSession,
      sessionType: SESSION_TYPES.special,
      trialLocation: mockRegularCityString,
      estimatedEndDate,
    };

    const { caseCountsAndSessionsByCity } = generateCalendar({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      constraints: [createMockConstraint(true)],
      specialSessions: [mockSpecialTrialSession],
      weeksToLoop: allWeeksToLoop,
    });

    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].scheduledSessions
        .length,
    ).toBeGreaterThan(1);
  });

  describe('extended calendar special sessions impacts on the calendaring of existing and subsequent trial sessions', () => {
    let startDate: string;
    let estimatedEndDate: string;
    let weeksInRange: IsoDateRange[];
    let extendedSpecialSession: any;
    let mockCaseCountsAndSessionsByCity: any;
    let caseCountsAndSessionsByCity: any;

    beforeEach(() => {
       startDate = createISODateString(
        mockWeekStringStart,
        FORMATS.YYYYMMDD,
      );

       estimatedEndDate = getBusinessDateInFuture({
        numberOfDays: 21,
        outputFormat: FORMATS.YYYYMMDD,
        startDate,
      });
       weeksInRange = getWeeksInRange({
        startDate,
        endDate: estimatedEndDate,
      });
       extendedSpecialSession = {
        ...mockTrialSession,
        sessionType: SESSION_TYPES.special,
        trialLocation: mockRegularCityString,
        estimatedEndDate,
      };
       mockCaseCountsAndSessionsByCity = {
        [mockRegularCityString]: {
          initialRegularCases: 10,
          initialSmallCases: 0,
          prospectiveSessions: [
            {
              cityWasNotVisitedInLastTwoTerms: false,
              sessionType: SESSION_TYPES.regular,
              trialLocation: mockRegularCityString,
            },
          ],
          remainingRegularCases: 10,
          remainingSmallCases: 0,
          scheduledSessions: [],
        },
        [mockSpecialCityString]: {
          initialRegularCases: 10,
          initialSmallCases: 0,
          prospectiveSessions: [
            {
              cityWasNotVisitedInLastTwoTerms: false,
              sessionType: SESSION_TYPES.regular,
              trialLocation: mockSpecialCityString,
            },
          ],
          remainingRegularCases: 10,
          remainingSmallCases: 0,
          scheduledSessions: [],
        },
      };
      ({caseCountsAndSessionsByCity} = generateCalendar({
        calendaringConfig: getMockCalendaringConfig(),
        caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
        constraints: [
          reservedWeekOfAtLocationConstraint,
          oneSessionPerLocationPerWeekConstraint,
        ],
        specialSessions: [extendedSpecialSession],
        weeksToLoop: weeksInRange,
      }));
    })

    it('should expect the special session to span multiple weeks', () => {
      const blockedLocation = caseCountsAndSessionsByCity[mockRegularCityString];

      expect(blockedLocation.scheduledSessions.length).toBeGreaterThan(3);
    });

    it('should expect all sessions to be special sessions', () => {
      const blockedLocation = caseCountsAndSessionsByCity[mockRegularCityString];

      expect(
        blockedLocation.scheduledSessions.every(
          session => session.sessionType === SESSION_TYPES.special,
        ),
      ).toBe(true);
    });

    it('should expect a cool down period after special session', () => {
      const blockedLocation = caseCountsAndSessionsByCity[mockRegularCityString];

      expect(blockedLocation.prospectiveSessions.length).toEqual(1);
    });

    it('should expect the special session to work', () => {
      const unblockedLocation =
        caseCountsAndSessionsByCity[mockSpecialCityString];

      expect(unblockedLocation.scheduledSessions[0].sessionType).toEqual(
        SESSION_TYPES.regular,
      );
    });
  })
});
