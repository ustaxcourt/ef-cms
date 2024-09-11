import { MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING } from '../../../../../shared/src/test/mockCase';
import {
  PROCEDURE_TYPES_MAP,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
// import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { scheduleTrialSessions } from './scheduleTrialSessions';
import mockCases from '../../../../../ourData.json';

// const mockSpecialSessions = [];
const mockCalendaringConfig = {
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

describe('scheduleTrialSessions', () => {
  // it('happy path', () => {
  //   let params = {
  //     calendaringConfig: mockCalendaringConfig,
  //     cases: mockCases,
  //     endDate: mockEndDate,
  //     specialSessions: [],
  //     startDate: mockStartDate,
  //   };

  //   let result = scheduleTrialSessions(params);

  //   // date range - trial sessions should only be scheduled within the provided date range
  //   // e.g. given a 5 week date range, 6 max per week, means a total of 30 sessions per run (given current config/dates)
  //   // We can only schedule 1 session per location per week
  //   // This means that max sessions per run is 5 (maxSessionPerLocation) * number of unique preferred trial cities in test data.
  //   // e.g. this maxes us at 10 sessions and 2 per week.
  //   // We need at least the mi
  // });

  it('should not schedule more than the max number of sessions for a given week when passed more regular cases than maxSessionsPerWeek * regularCaseMaxQuantity', () => {
    // for (let i = 0; i < totalNumberOfMockCases; ++i) {
    //   mockCases.push({
    //     ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
    //     docketNumber: `10${i}-24`,
    //     preferredTrialCity: TRIAL_CITY_STRINGS[0],
    //     procedureType: PROCEDURE_TYPES_MAP.regular,
    //   });
    // }

    const totalNumberOfMockCases =
      mockCalendaringConfig.maxSessionsPerWeek *
        mockCalendaringConfig.regularCaseMaxQuantity +
      mockCalendaringConfig.regularCaseMinimumQuantity;

    let params = {
      calendaringConfig: mockCalendaringConfig,
      cases: mockCases,
      endDate: mockEndDate,
      specialSessions: [],
      startDate: mockStartDate,
    };

    let result = scheduleTrialSessions(params);

    const weekOfMap = result.reduce((acc, session) => {
      acc[session.weekOf] = (acc[session.weekOf] || 0) + 1;
      return acc;
    }, {});

    Object.values(weekOfMap).forEach(count => {
      expect(count).toBeLessThanOrEqual(
        mockCalendaringConfig.maxSessionsPerWeek,
      );
    });

    // expect(result).toEqual([
    //   {
    //     city: 'City A',
    //     sessionType: SESSION_TYPES.regular,
    //     weekOf: '01/01/01',
    //   },
    //   {
    //     city: 'City B',
    //     sessionType: SESSION_TYPES.small,
    //     weekOf: '01/07/01',
    //   },
    // ]);
  });
});
