import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { ProspectiveSessionsByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import {
  ScheduledTrialSession,
  assignSessionsToWeeks,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { getUniqueId } from '@shared/sharedAppContext';
import { getWeeksInRange } from '@shared/business/utilities/DateHandler';

const defaultMockCalendaringConfig = {
  hybridCaseMaxQuantity: 10,
  hybridCaseMinimumQuantity: 5,
  maxSessionsPerLocation: 5, // Note that we may need to rethink this and maxSessionsPerWeek for testing purposes
  maxSessionsPerWeek: 6,
  regularCaseMaxQuantity: 10,
  regularCaseMinimumQuantity: 4,
  smallCaseMaxQuantity: 13,
  smallCaseMinimumQuantity: 4,
};

const mockEndDate = '2019-12-10T04:00:00.000Z';
const mockStartDate = '2019-08-22T04:00:00.000Z';
const mockWeeksToLoop = getWeeksInRange({
  endDate: mockEndDate,
  startDate: mockStartDate,
});

function getMockTrialSessions() {
  const mockSessions: ProspectiveSessionsByCity = {};

  const numberOfSessions = defaultMockCalendaringConfig.maxSessionsPerWeek + 1;

  for (let i = 0; i < numberOfSessions; ++i) {
    mockSessions[TRIAL_CITY_STRINGS[i]] = [
      {
        city: `${TRIAL_CITY_STRINGS[i]}`,
        cityWasNotVisitedInLastTwoTerms: false,
        sessionType: SESSION_TYPES.regular,
      },
    ];
  }

  return mockSessions;
}

function getMockTrialSessionsForSingleCity() {
  const mockSessions: ProspectiveSessionsByCity = {};

  const numberOfSessions =
    defaultMockCalendaringConfig.maxSessionsPerLocation + 1;

  for (let i = 0; i < numberOfSessions; ++i) {
    if (!mockSessions[TRIAL_CITY_STRINGS[0]]) {
      mockSessions[TRIAL_CITY_STRINGS[0]] = [];
    }
    mockSessions[TRIAL_CITY_STRINGS[0]].push({
      city: `${TRIAL_CITY_STRINGS[0]}`,
      cityWasNotVisitedInLastTwoTerms: false,
      sessionType: SESSION_TYPES.regular,
    });
  }
  return mockSessions;
}

describe('assignSessionsToWeeks', () => {
  it('should not schedule more than the maximum number of sessions for a given week', () => {
    const mockSessions = getMockTrialSessions();

    const { scheduledTrialSessionsByCity, sessionCountPerWeek } =
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockSessions,
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: [],
        weeksToLoop: mockWeeksToLoop,
      });

    let flatSessionArray: ScheduledTrialSession[] = [];
    Object.values(scheduledTrialSessionsByCity).forEach(sessions => {
      flatSessionArray.push(...sessions);
    });

    const weekOfMap = flatSessionArray.reduce((acc, session) => {
      acc[session.weekOf] = (acc[session.weekOf] || 0) + 1;
      return acc;
    }, {});

    expect(Object.values(sessionCountPerWeek)[0]).toEqual(
      defaultMockCalendaringConfig.maxSessionsPerWeek,
    );
    expect(Object.values(weekOfMap)[0]).toEqual(
      defaultMockCalendaringConfig.maxSessionsPerWeek,
    );
  });

  it('should assign no more than the max number of sessions per location when passed more than the max for a given location', () => {
    const mockSessions = getMockTrialSessionsForSingleCity();
    const { scheduledTrialSessionsByCity, sessionCountPerWeek } =
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockSessions,
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: [],
        weeksToLoop: mockWeeksToLoop,
      });

    expect(Object.values(scheduledTrialSessionsByCity)[0].length).toEqual(
      defaultMockCalendaringConfig.maxSessionsPerLocation,
    );

    Object.values(sessionCountPerWeek).forEach(countForWeek => {
      expect(countForWeek).toBeLessThanOrEqual(1);
    });
  });

  it('should assign no more than the max number of sessions per location when passed more than the max for a given location, including special sessions', () => {
    const mockSpecialSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-11-22T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-11-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
    ];
    const mockSessions = getMockTrialSessionsForSingleCity();

    const { scheduledTrialSessionsByCity, sessionCountPerWeek } =
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockSessions,
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: mockSpecialSessions,
        weeksToLoop: mockWeeksToLoop,
      });

    expect(scheduledTrialSessionsByCity[TRIAL_CITY_STRINGS[0]].length).toEqual(
      defaultMockCalendaringConfig.maxSessionsPerLocation,
    );

    Object.values(sessionCountPerWeek).forEach(countForWeek => {
      expect(countForWeek).toBeLessThanOrEqual(1);
    });
  });

  it('should prioritize special sessions over non-special sessions', () => {
    const mockSpecialSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-22T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-05T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-12T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-19T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
    ];

    const mockSessions = getMockTrialSessionsForSingleCity();
    const { scheduledTrialSessionsByCity } = assignSessionsToWeeks({
      calendaringConfig: defaultMockCalendaringConfig,
      prospectiveSessionsByCity: mockSessions,
      regularCaseCountByCity: {},
      smallCaseCountByCity: {},
      specialSessions: mockSpecialSessions,
      weeksToLoop: mockWeeksToLoop,
    });

    expect(Object.values(scheduledTrialSessionsByCity)[0].length).toEqual(
      mockSpecialSessions.length,
    );

    // 5 special sessions at the same location
    // 1 non-special session also at that same location
    // in the end, we should have 5 special sessions scheduled for that location and that's it
  });

  it('should throw an error when passed more than one special session in the same location for the same week', () => {
    const mockSpecialSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
    ];

    const mockSessions = getMockTrialSessionsForSingleCity();

    expect(() => {
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockSessions,
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: mockSpecialSessions,
        weeksToLoop: mockWeeksToLoop,
      });
    }).toThrow(
      'There must only be one special trial session per location per week.',
    );
    // 5 special sessions, all at different locations, in the same week
    // 2 non-special sessions, all at different locations, in the same week
    // in the end, we should have 5 special and 1 non-special scheduled for that week
  });

  it('should throw an error when passed more special sessions in one location than the maximum allowed for that location', () => {
    const mockSpecialSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-30T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-01T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-02T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-03T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-04T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
    ];

    const mockSessions = getMockTrialSessionsForSingleCity();

    expect(() => {
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockSessions,
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: mockSpecialSessions,
        weeksToLoop: mockWeeksToLoop,
      });
    }).toThrow(
      `Special session count exceeds the max sessions per location for ${TRIAL_CITY_STRINGS[0]}`,
    );
  });

  it('should allow for double the maximum number of special sessions for Washington, DC as there are two DC-based courtrooms', () => {
    const mockSpecialSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-22T04:00:00.000Z',
        trialLocation: WASHINGTON_DC_STRING,
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-22T04:00:00.000Z',
        trialLocation: WASHINGTON_DC_STRING,
        trialSessionId: getUniqueId(),
      },
    ];

    const mockSessions = {};

    const { scheduledTrialSessionsByCity, sessionCountPerWeek } =
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockSessions,
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: mockSpecialSessions,
        weeksToLoop: mockWeeksToLoop,
      });

    expect(
      scheduledTrialSessionsByCity[WASHINGTON_DC_SOUTH_STRING].length,
    ).toEqual(1);
    expect(
      scheduledTrialSessionsByCity[WASHINGTON_DC_NORTH_STRING].length,
    ).toEqual(1);

    expect(Object.values(sessionCountPerWeek)[0]).toEqual(2);
  });

  it('should not allow for more than double the maximum', () => {
    const mockSpecialSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-22T04:00:00.000Z',
        trialLocation: WASHINGTON_DC_STRING,
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-22T04:00:00.000Z',
        trialLocation: WASHINGTON_DC_STRING,
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-22T04:00:00.000Z',
        trialLocation: WASHINGTON_DC_STRING,
        trialSessionId: getUniqueId(),
      },
    ];

    const mockSessions = {};

    expect(() => {
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockSessions,
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: mockSpecialSessions,
        weeksToLoop: mockWeeksToLoop,
      });
    }).toThrow(
      'There must be no more than two special trial sessions per week in Washington, DC.',
    );
  });

  it('should schedule one regular and one special session in the same week despite the max per week per location', () => {
    const mockSpecialSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-22T04:00:00.000Z',
        trialLocation: WASHINGTON_DC_STRING,
        trialSessionId: getUniqueId(),
      },
    ];

    const mockSessions = {
      [WASHINGTON_DC_STRING]: [
        {
          city: WASHINGTON_DC_STRING,
          cityWasNotVisitedInLastTwoTerms: false,
          sessionType: SESSION_TYPES.regular,
        },
      ],
    };

    const { scheduledTrialSessionsByCity, sessionCountPerWeek } =
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockSessions,
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: mockSpecialSessions,
        weeksToLoop: mockWeeksToLoop,
      });

    expect(
      scheduledTrialSessionsByCity[WASHINGTON_DC_SOUTH_STRING].length,
    ).toEqual(1);
    expect(
      scheduledTrialSessionsByCity[WASHINGTON_DC_NORTH_STRING].length,
    ).toEqual(1);

    expect(Object.values(sessionCountPerWeek)[0]).toEqual(2);
  });

  it('should schedule no more than one non-special session per week in Washington, DC', () => {
    const mockSessions = {
      [WASHINGTON_DC_STRING]: [
        {
          city: WASHINGTON_DC_STRING,
          cityWasNotVisitedInLastTwoTerms: false,
          sessionType: SESSION_TYPES.regular,
        },
        {
          city: WASHINGTON_DC_STRING,
          cityWasNotVisitedInLastTwoTerms: false,
          sessionType: SESSION_TYPES.regular,
        },
      ],
    };

    const WEEK_ONE = '2019-08-19';
    const WEEK_TWO = '2019-08-26';

    const { scheduledTrialSessionsByCity, sessionCountPerWeek } =
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockSessions,
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: [],
        weeksToLoop: mockWeeksToLoop,
      });

    expect(scheduledTrialSessionsByCity[WASHINGTON_DC_SOUTH_STRING][0]).toEqual(
      {
        city: WASHINGTON_DC_SOUTH_STRING,
        sessionType: SESSION_TYPES.regular,
        weekOf: WEEK_ONE,
      },
    );
    expect(scheduledTrialSessionsByCity[WASHINGTON_DC_SOUTH_STRING][1]).toEqual(
      {
        city: WASHINGTON_DC_SOUTH_STRING,
        sessionType: SESSION_TYPES.regular,
        weekOf: WEEK_TWO,
      },
    );

    expect(sessionCountPerWeek[WEEK_ONE]).toEqual(1);
    expect(sessionCountPerWeek[WEEK_TWO]).toEqual(1);
  });

  it('should return an object with keys for each of TRIAL_CITY_STRINGS, with two Washington locations', () => {
    const expectedKeys: string[] = [];
    TRIAL_CITY_STRINGS.forEach(cityString => {
      if (cityString === WASHINGTON_DC_STRING) {
        expectedKeys.push(WASHINGTON_DC_NORTH_STRING);
        expectedKeys.push(WASHINGTON_DC_SOUTH_STRING);
      } else {
        expectedKeys.push(cityString);
      }
    });

    const { scheduledTrialSessionsByCity, sessionCountPerWeek } =
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: {},
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: [],
        weeksToLoop: mockWeeksToLoop,
      });

    expectedKeys.forEach(expectedKey => {
      expect(Object.keys(scheduledTrialSessionsByCity)).toContain(expectedKey);
    });

    Object.values(sessionCountPerWeek).forEach(countForWeek => {
      expect(countForWeek).toEqual(0);
    });
  });

  it('should not schedule a non-special session on the week after a scheduled special session', () => {
    const mockSpecialSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-24T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
    ];

    const mockProspectiveSessionsByCity = {
      [TRIAL_CITY_STRINGS[0]]: [
        {
          city: `${TRIAL_CITY_STRINGS[0]}`,
          cityWasNotVisitedInLastTwoTerms: false,
          sessionType: SESSION_TYPES.regular,
        },
      ],
    };

    const { scheduledTrialSessionsByCity, sessionCountPerWeek } =
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockProspectiveSessionsByCity,
        regularCaseCountByCity: {},
        smallCaseCountByCity: {},
        specialSessions: mockSpecialSessions,
        weeksToLoop: mockWeeksToLoop,
      });

    const secondWeek = mockWeeksToLoop[1];

    const sessionScheduledForSecondWeek = scheduledTrialSessionsByCity[
      TRIAL_CITY_STRINGS[0]
    ].filter(
      scheduledTrialSession => scheduledTrialSession.weekOf === secondWeek,
    );

    expect(sessionScheduledForSecondWeek.length).toBe(0);
    expect(sessionCountPerWeek[secondWeek]).toBe(0);
  });
});
