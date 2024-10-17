import {
  CasesByCity,
  EligibleCase,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import { MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING } from '../../../../../../shared/src/test/mockCase';
import {
  PROCEDURE_TYPES_MAP,
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { createProspectiveTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';

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
const mockRegularCityString = TRIAL_CITY_STRINGS[TRIAL_CITY_STRINGS.length - 1];
const mockSmallCityString = TRIAL_CITY_STRINGS[0];

function getMockCasesByCity(
  cases: EligibleCase[],
  type: TrialSessionTypes,
): CasesByCity {
  return cases
    .filter(c => c.procedureType === type)
    .reduce((acc, currentCase) => {
      if (!acc[currentCase.preferredTrialCity!]) {
        acc[currentCase.preferredTrialCity!] = [];
      }
      acc[currentCase.preferredTrialCity!].push(currentCase);
      return acc;
    }, {});
}

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
          preferredTrialCity: mockRegularCityString,
          procedureType: PROCEDURE_TYPES_MAP.regular,
        });
      }

      const mockRegularCasesByCity = getMockCasesByCity(
        mockCases,
        PROCEDURE_TYPES_MAP.regular,
      );
      const mockSmallCasesByCity = getMockCasesByCity(
        mockCases,
        PROCEDURE_TYPES_MAP.small,
      );

      const { prospectiveSessionsByCity } = createProspectiveTrialSessions({
        calendaringConfig: defaultMockCalendaringConfig,
        citiesFromLastTwoTerms: TRIAL_CITY_STRINGS,
        regularCasesByCity: mockRegularCasesByCity,
        smallCasesByCity: mockSmallCasesByCity,
      });

      expect(prospectiveSessionsByCity[mockRegularCityString].length).toEqual(
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
          preferredTrialCity: mockRegularCityString,
          procedureType: PROCEDURE_TYPES_MAP.regular,
        });
      }

      for (let i = 0; i < totalNumberOfSmallMockCases; ++i) {
        mockCases.push({
          ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
          docketNumber: `10${i}-23`,
          preferredTrialCity: mockRegularCityString,
          procedureType: PROCEDURE_TYPES_MAP.small,
        });
      }

      const mockRegularCasesByCity = getMockCasesByCity(
        mockCases,
        PROCEDURE_TYPES_MAP.regular,
      );
      const mockSmallCasesByCity = getMockCasesByCity(
        mockCases,
        PROCEDURE_TYPES_MAP.small,
      );

      const { prospectiveSessionsByCity } = createProspectiveTrialSessions({
        calendaringConfig: defaultMockCalendaringConfig,
        citiesFromLastTwoTerms: TRIAL_CITY_STRINGS,
        regularCasesByCity: mockRegularCasesByCity,
        smallCasesByCity: mockSmallCasesByCity,
      });

      expect(
        prospectiveSessionsByCity[mockRegularCityString][0].sessionType,
      ).toEqual(SESSION_TYPES.small);
      expect(
        prospectiveSessionsByCity[mockRegularCityString][1].sessionType,
      ).toEqual(SESSION_TYPES.regular);
      expect(
        prospectiveSessionsByCity[mockRegularCityString][2].sessionType,
      ).toEqual(SESSION_TYPES.hybrid);
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

      const mockCases: RawCase[] = [];
      for (let i = 0; i < totalNumberOfRegularMockCases; ++i) {
        mockCases.push({
          ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
          docketNumber: `10${i}-24`,
          preferredTrialCity: mockRegularCityString,
          procedureType: PROCEDURE_TYPES_MAP.regular,
        });
      }

      for (let i = 0; i < totalNumberOfSmallMockCases; ++i) {
        mockCases.push({
          ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
          docketNumber: `10${i}-23`,
          preferredTrialCity: mockRegularCityString,
          procedureType: PROCEDURE_TYPES_MAP.small,
        });
      }

      const mockRegularCasesByCity = getMockCasesByCity(
        mockCases,
        PROCEDURE_TYPES_MAP.regular,
      );
      const mockSmallCasesByCity = getMockCasesByCity(
        mockCases,
        PROCEDURE_TYPES_MAP.small,
      );

      const { prospectiveSessionsByCity } = createProspectiveTrialSessions({
        calendaringConfig: mockCalendaringConfig,
        citiesFromLastTwoTerms: TRIAL_CITY_STRINGS,
        regularCasesByCity: mockRegularCasesByCity,
        smallCasesByCity: mockSmallCasesByCity,
      });

      expect(
        prospectiveSessionsByCity[mockRegularCityString][0].sessionType,
      ).toEqual(SESSION_TYPES.regular);
      expect(
        prospectiveSessionsByCity[mockRegularCityString][1].sessionType,
      ).toEqual(SESSION_TYPES.small);
      expect(
        prospectiveSessionsByCity[mockRegularCityString][2].sessionType,
      ).toEqual(SESSION_TYPES.hybrid);
    },
  );

  it.skip('should throw an error when attempting to schedule a regular case at a small city', () => {
    const mockCases: RawCase[] = [];

    mockCases.push({
      ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
      docketNumber: '101-24',
      // This is a small-only city
      preferredTrialCity: mockSmallCityString,
      procedureType: PROCEDURE_TYPES_MAP.regular,
    });

    const mockRegularCasesByCity = getMockCasesByCity(
      mockCases,
      PROCEDURE_TYPES_MAP.regular,
    );
    const mockSmallCasesByCity = getMockCasesByCity(
      mockCases,
      PROCEDURE_TYPES_MAP.small,
    );

    expect(() => {
      createProspectiveTrialSessions({
        calendaringConfig: defaultMockCalendaringConfig,
        citiesFromLastTwoTerms: TRIAL_CITY_STRINGS,
        regularCasesByCity: mockRegularCasesByCity,
        smallCasesByCity: mockSmallCasesByCity,
      });
    }).toThrow(Error);
  });

  it('should ignore regular case minimums and schedule a session for a location that has not been visited in the previous two terms', () => {
    const totalNumberOfMockCases =
      defaultMockCalendaringConfig.maxSessionsPerLocation *
        defaultMockCalendaringConfig.regularCaseMaxQuantity +
      defaultMockCalendaringConfig.regularCaseMaxQuantity;

    const indexOfMockLowVolumeCityString = TRIAL_CITY_STRINGS.length - 2;
    const mockLowVolumeCityString =
      TRIAL_CITY_STRINGS[indexOfMockLowVolumeCityString];
    let mockTrialCitiesFromLastTwoTerms = [...TRIAL_CITY_STRINGS];
    mockTrialCitiesFromLastTwoTerms.splice(indexOfMockLowVolumeCityString, 1);

    const mockCases: RawCase[] = [];
    for (let i = 0; i < totalNumberOfMockCases; ++i) {
      mockCases.push({
        ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
        docketNumber: `10${i}-24`,
        preferredTrialCity: mockRegularCityString,
        procedureType: PROCEDURE_TYPES_MAP.regular,
      });
    }

    mockCases.push({
      ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
      docketNumber: '999-24',
      preferredTrialCity: mockLowVolumeCityString,
      procedureType: PROCEDURE_TYPES_MAP.regular,
    });

    const mockRegularCasesByCity = getMockCasesByCity(
      mockCases,
      PROCEDURE_TYPES_MAP.regular,
    );
    const mockSmallCasesByCity = getMockCasesByCity(
      mockCases,
      PROCEDURE_TYPES_MAP.small,
    );

    const { prospectiveSessionsByCity } = createProspectiveTrialSessions({
      calendaringConfig: defaultMockCalendaringConfig,
      citiesFromLastTwoTerms: mockTrialCitiesFromLastTwoTerms,
      regularCasesByCity: mockRegularCasesByCity,
      smallCasesByCity: mockSmallCasesByCity,
    });

    const includedLocations = Object.keys(prospectiveSessionsByCity);

    expect(prospectiveSessionsByCity[mockRegularCityString].length).toEqual(
      defaultMockCalendaringConfig.maxSessionsPerLocation,
    );
    expect(includedLocations).toEqual([
      mockRegularCityString,
      mockLowVolumeCityString,
    ]);
    expect(prospectiveSessionsByCity[mockLowVolumeCityString].length).toEqual(
      1,
    );
    expect(
      prospectiveSessionsByCity[mockLowVolumeCityString][0]
        .cityWasNotVisitedInLastTwoTerms,
    ).toEqual(true);
    expect(
      prospectiveSessionsByCity[mockLowVolumeCityString][0].sessionType,
    ).toEqual(SESSION_TYPES.regular);
  });

  it('should ignore small case minimums and schedule a session for a location that has not been visited in the previous two terms', () => {
    const totalNumberOfMockCases =
      defaultMockCalendaringConfig.maxSessionsPerLocation *
        defaultMockCalendaringConfig.smallCaseMaxQuantity +
      defaultMockCalendaringConfig.smallCaseMaxQuantity;

    const indexOfMockLowVolumeCityString = TRIAL_CITY_STRINGS.length - 2;
    const mockLowVolumeCityString =
      TRIAL_CITY_STRINGS[indexOfMockLowVolumeCityString];
    let mockTrialCitiesFromLastTwoTerms = [...TRIAL_CITY_STRINGS];
    mockTrialCitiesFromLastTwoTerms.splice(indexOfMockLowVolumeCityString, 1);

    const mockCases: RawCase[] = [];
    for (let i = 0; i < totalNumberOfMockCases; ++i) {
      mockCases.push({
        ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
        docketNumber: `10${i}-24`,
        preferredTrialCity: mockRegularCityString,
        procedureType: PROCEDURE_TYPES_MAP.small,
      });
    }

    mockCases.push({
      ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
      docketNumber: '999-24',
      preferredTrialCity: mockLowVolumeCityString,
      procedureType: PROCEDURE_TYPES_MAP.small,
    });

    const mockRegularCasesByCity = getMockCasesByCity(
      mockCases,
      PROCEDURE_TYPES_MAP.regular,
    );
    const mockSmallCasesByCity = getMockCasesByCity(
      mockCases,
      PROCEDURE_TYPES_MAP.small,
    );

    const { prospectiveSessionsByCity } = createProspectiveTrialSessions({
      calendaringConfig: defaultMockCalendaringConfig,
      citiesFromLastTwoTerms: mockTrialCitiesFromLastTwoTerms,
      regularCasesByCity: mockRegularCasesByCity,
      smallCasesByCity: mockSmallCasesByCity,
    });

    const includedLocations = Object.keys(prospectiveSessionsByCity);

    expect(prospectiveSessionsByCity[mockRegularCityString].length).toEqual(
      defaultMockCalendaringConfig.maxSessionsPerLocation,
    );
    expect(includedLocations).toEqual([
      mockRegularCityString,
      mockLowVolumeCityString,
    ]);
    expect(prospectiveSessionsByCity[mockLowVolumeCityString].length).toEqual(
      1,
    );
    expect(
      prospectiveSessionsByCity[mockLowVolumeCityString][0]
        .cityWasNotVisitedInLastTwoTerms,
    ).toEqual(true);
    expect(
      prospectiveSessionsByCity[mockLowVolumeCityString][0].sessionType,
    ).toEqual(SESSION_TYPES.small);
  });

  it('should ignore hybrid case minimums and schedule a session for a location that has not been visited in the previous two terms', () => {
    const totalNumberOfMockCases =
      defaultMockCalendaringConfig.maxSessionsPerLocation *
        defaultMockCalendaringConfig.hybridCaseMaxQuantity +
      defaultMockCalendaringConfig.hybridCaseMaxQuantity;

    const indexOfMockLowVolumeCityString = TRIAL_CITY_STRINGS.length - 2;
    const mockLowVolumeCityString =
      TRIAL_CITY_STRINGS[indexOfMockLowVolumeCityString];
    let mockTrialCitiesFromLastTwoTerms = [...TRIAL_CITY_STRINGS];
    mockTrialCitiesFromLastTwoTerms.splice(indexOfMockLowVolumeCityString, 1);

    const mockCases: RawCase[] = [];
    for (let i = 0; i < totalNumberOfMockCases; ++i) {
      mockCases.push({
        ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
        docketNumber: `10${i}-24`,
        preferredTrialCity: mockRegularCityString,
        procedureType: PROCEDURE_TYPES_MAP.small,
      });
    }

    mockCases.push({
      ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
      docketNumber: '999-24',
      preferredTrialCity: mockLowVolumeCityString,
      procedureType: PROCEDURE_TYPES_MAP.small,
    });

    mockCases.push({
      ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
      docketNumber: '998-24',
      preferredTrialCity: mockLowVolumeCityString,
      procedureType: PROCEDURE_TYPES_MAP.regular,
    });

    const mockRegularCasesByCity = getMockCasesByCity(
      mockCases,
      PROCEDURE_TYPES_MAP.regular,
    );
    const mockSmallCasesByCity = getMockCasesByCity(
      mockCases,
      PROCEDURE_TYPES_MAP.small,
    );

    const { prospectiveSessionsByCity } = createProspectiveTrialSessions({
      calendaringConfig: defaultMockCalendaringConfig,
      citiesFromLastTwoTerms: mockTrialCitiesFromLastTwoTerms,
      regularCasesByCity: mockRegularCasesByCity,
      smallCasesByCity: mockSmallCasesByCity,
    });

    const includedLocations = Object.keys(prospectiveSessionsByCity);

    expect(prospectiveSessionsByCity[mockRegularCityString].length).toEqual(
      defaultMockCalendaringConfig.maxSessionsPerLocation,
    );
    expect(includedLocations).toEqual([
      mockLowVolumeCityString,
      mockRegularCityString,
    ]);
    expect(prospectiveSessionsByCity[mockLowVolumeCityString].length).toEqual(
      1,
    );
    expect(
      prospectiveSessionsByCity[mockLowVolumeCityString][0]
        .cityWasNotVisitedInLastTwoTerms,
    ).toEqual(true);
    expect(
      prospectiveSessionsByCity[mockLowVolumeCityString][0].sessionType,
    ).toEqual(SESSION_TYPES.hybrid);
  });
});
