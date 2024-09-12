import {
  PROCEDURE_TYPES_MAP,
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

describe('assignSessionsToWeeks', () => {
  it(
    'should not schedule more than the max number of sessions for a given city' +
      'when passed more regular cases than maxSessionsPerLocation * regularCaseMaxQuantity',
    () => {
      const mockSessions: Record<
        string,
        {
          city: string;
          sessionType: TrialSessionTypes;
        }[]
      >;

      for (let i = 0; i < 10; ++i) {
        const city = i;
        mockSessions[city] = {
          city: `${i}`,
          sessionType: SESSION_TYPES.regular,
        };
      }

      const result = assignSessionsToWeeks({});

      expect(result).toEqual({});
    },
  );
});
