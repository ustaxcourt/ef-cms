import { MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING } from '../../../../../../shared/src/test/mockCase';
import {
  PROCEDURE_TYPES_MAP,
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import { createProspectiveTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
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

describe('createProspectiveTrialSessions', () => {
  it(
    'should not schedule more than the max number of sessions for a given city' +
      'when passed more regular cases than maxSessionsPerLocation * regularCaseMaxQuantity',
    () => {
      const totalNumberOfMockCases =
        defaultMockCalendaringConfig.maxSessionsPerLocation *
          defaultMockCalendaringConfig.regularCaseMaxQuantity +
        defaultMockCalendaringConfig.regularCaseMaxQuantity;

      const mockCases: RawCase[] = [];
      for (let i = 0; i < totalNumberOfMockCases; ++i) {
        mockCases.push({
          ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
          docketNumber: `10${i}-24`,
          preferredTrialCity: TRIAL_CITY_STRINGS[0],
          procedureType: PROCEDURE_TYPES_MAP.regular,
        });
      }

      const result = createProspectiveTrialSessions({
        calendaringConfig: defaultMockCalendaringConfig,
        cases: mockCases,
      });

      expect(result[TRIAL_CITY_STRINGS[0]].length).toEqual(
        defaultMockCalendaringConfig.maxSessionsPerLocation,
      );
    },
  );

  it(
    'should appropriately divide cases into regular, small, and hybrid sessions, and prioritizes small cases' +
      'when all the cases are in one location and there are more small cases than regular',
    () => {
      const totalNumberOfSmallMockCases =
        defaultMockCalendaringConfig.smallCaseMaxQuantity +
        defaultMockCalendaringConfig.hybridCaseMinimumQuantity / 2;
      const totalNumberOfRegularMockCases =
        defaultMockCalendaringConfig.regularCaseMaxQuantity +
        defaultMockCalendaringConfig.hybridCaseMinimumQuantity / 2;

      const mockCases: RawCase[] = [];
      for (let i = 0; i < totalNumberOfRegularMockCases; ++i) {
        mockCases.push({
          ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
          docketNumber: `10${i}-24`,
          preferredTrialCity: TRIAL_CITY_STRINGS[0],
          procedureType: PROCEDURE_TYPES_MAP.regular,
        });
      }

      for (let i = 0; i < totalNumberOfSmallMockCases; ++i) {
        mockCases.push({
          ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
          docketNumber: `10${i}-23`,
          preferredTrialCity: TRIAL_CITY_STRINGS[0],
          procedureType: PROCEDURE_TYPES_MAP.small,
        });
      }

      const result = createProspectiveTrialSessions({
        calendaringConfig: defaultMockCalendaringConfig,
        cases: mockCases,
      });

      expect(result[TRIAL_CITY_STRINGS[0]][0].sessionType).toEqual(
        SESSION_TYPES.small,
      );
      expect(result[TRIAL_CITY_STRINGS[0]][1].sessionType).toEqual(
        SESSION_TYPES.regular,
      );
      expect(result[TRIAL_CITY_STRINGS[0]][2].sessionType).toEqual(
        SESSION_TYPES.hybrid,
      );
    },
  );

  it(
    'should appropriately divide cases into regular, small, and hybrid sessions, and prioritizes regular cases' +
      'when all the cases are in one location and there are fewer small cases than regular',
    () => {
      const mockCalendaringConfig = {
        hybridCaseMaxQuantity: 100,
        hybridCaseMinimumQuantity: 50,
        maxSessionsPerLocation: 50, // Note that we may need to rethink this and maxSessionsPerWeek for testing purposes
        maxSessionsPerWeek: 60,
        regularCaseMaxQuantity: 100,
        regularCaseMinimumQuantity: 40,
        smallCaseMaxQuantity: 125,
        smallCaseMinimumQuantity: 40,
      };

      const totalNumberOfSmallMockCases =
        mockCalendaringConfig.smallCaseMaxQuantity + 11;
      const totalNumberOfRegularMockCases =
        mockCalendaringConfig.regularCaseMaxQuantity + 39;

      console.log(
        'totalNumberOfRegularMockCases',
        totalNumberOfRegularMockCases,
      );
      console.log('totalNumberOfSmallMockCases', totalNumberOfSmallMockCases);

      const mockCases: RawCase[] = [];
      for (let i = 0; i < totalNumberOfRegularMockCases; ++i) {
        mockCases.push({
          ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
          docketNumber: `10${i}-24`,
          preferredTrialCity: TRIAL_CITY_STRINGS[0],
          procedureType: PROCEDURE_TYPES_MAP.regular,
        });
      }

      for (let i = 0; i < totalNumberOfSmallMockCases; ++i) {
        mockCases.push({
          ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
          docketNumber: `10${i}-23`,
          preferredTrialCity: TRIAL_CITY_STRINGS[0],
          procedureType: PROCEDURE_TYPES_MAP.small,
        });
      }

      const result = createProspectiveTrialSessions({
        calendaringConfig: mockCalendaringConfig,
        cases: mockCases,
      });

      console.log('results', result);

      expect(result[TRIAL_CITY_STRINGS[0]][0].sessionType).toEqual(
        SESSION_TYPES.regular,
      );
      expect(result[TRIAL_CITY_STRINGS[0]][1].sessionType).toEqual(
        SESSION_TYPES.small,
      );
      expect(result[TRIAL_CITY_STRINGS[0]][2].sessionType).toEqual(
        SESSION_TYPES.hybrid,
      );
    },
  );
});
