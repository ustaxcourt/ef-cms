import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { assignSessionsToWeeks } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
// import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';

// const mockSpecialSessions = [];
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

const mockEndDate = '2019-09-22T04:00:00.000Z';
const mockStartDate = '2019-08-22T04:00:00.000Z';

function getMockTrialSessions() {
  const mockSessions: Record<
    string,
    {
      city: string;
      sessionType: TrialSessionTypes;
    }[]
  > = {};

  const numberOfSessions = defaultMockCalendaringConfig.maxSessionsPerWeek + 1;

  for (let i = 0; i < numberOfSessions; ++i) {
    mockSessions[TRIAL_CITY_STRINGS[i]] = [
      {
        city: `${TRIAL_CITY_STRINGS[i]}`,
        sessionType: SESSION_TYPES.regular,
      },
    ];
  }

  return mockSessions;
}

describe('assignSessionsToWeeks', () => {
  it('should not schedule more than the maximum number of sessions for a given week', () => {
    const mockSessions = getMockTrialSessions();

    const result = assignSessionsToWeeks({
      calendaringConfig: defaultMockCalendaringConfig,
      endDate: mockEndDate,
      prospectiveSessionsByCity: mockSessions,
      specialSessions: [],
      startDate: mockStartDate,
    });

    //TODO: refactor this
    const weekOfMap = result.reduce((acc, session) => {
      acc[session.weekOf] = (acc[session.weekOf] || 0) + 1;
      return acc;
    }, {});

    expect(Object.values(weekOfMap)[0]).toEqual(
      defaultMockCalendaringConfig.maxSessionsPerWeek,
    );
  });
});
