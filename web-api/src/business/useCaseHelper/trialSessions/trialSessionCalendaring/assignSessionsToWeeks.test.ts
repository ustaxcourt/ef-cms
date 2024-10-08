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

const mockEndDate = '2019-10-10T04:00:00.000Z';
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
    const { scheduledTrialSessions, sessionCountPerWeek } =
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        prospectiveSessionsByCity: mockSessions,
        specialSessions: [],
        weeksToLoop: mockWeeksToLoop,
      });

    expect(scheduledTrialSessions.length).toEqual(
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
    const { scheduledTrialSessions } = assignSessionsToWeeks({
      calendaringConfig: defaultMockCalendaringConfig,
      prospectiveSessionsByCity: mockSessions,
      specialSessions: mockSpecialSessions,
      weeksToLoop: mockWeeksToLoop,
    });

    expect(scheduledTrialSessions.length).toEqual(mockSpecialSessions.length);

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
        specialSessions: mockSpecialSessions,
        weeksToLoop: mockWeeksToLoop,
      });
    }).toThrow(
      'There must only be one special trial session per location per week.',
    );
  });
  // 5 special sessions, all at different locations, in the same week
  // 2 non-special sessions, all at different locations, in the same week
  // in the end, we should have 5 special and 1 non-special scheduled for that week

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
        specialSessions: mockSpecialSessions,
        weeksToLoop: mockWeeksToLoop,
      });
    }).toThrow(
      `Special session count exceeds the max sessions per location for ${TRIAL_CITY_STRINGS[0]}`,
    );
  });
});
