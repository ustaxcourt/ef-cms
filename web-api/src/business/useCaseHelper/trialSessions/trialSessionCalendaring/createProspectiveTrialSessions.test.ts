import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import {
  EligibleCase,
  getDataForCalendaring,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import { MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING } from '@shared/test/mockCase';
import {
  PROCEDURE_TYPES_MAP,
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import { createProspectiveTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import { v4 } from 'uuid';

const mockRegularCityString = TRIAL_CITY_STRINGS[TRIAL_CITY_STRINGS.length - 1];

const getMockCalendaringConfig = (overrides = {}) => ({
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

const generateMockCases = ({ city, count, procedureType }) => {
  const cases: EligibleCase[] = [];
  for (let i = 0; i < count; i++) {
    cases.push({
      ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
      docketNumber: `${v4()}${i}-24`,
      preferredTrialCity: city,
      procedureType,
    });
  }
  return cases;
};

describe('createProspectiveTrialSessions', () => {
  it(
    'should create only as many prospective trial sessions as the specified ' +
      'maximum quantity of trial sessions',
    () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();

      const totalNumberOfMockCases =
        mockCalendaringConfig.maxSessionsPerLocation *
          mockCalendaringConfig.regularCaseMaxQuantity +
        mockCalendaringConfig.regularCaseMaxQuantity;

      const mockCases = [
        ...generateMockCases({
          city: mockRegularCityString,
          count: totalNumberOfMockCases,
          procedureType: PROCEDURE_TYPES_MAP.regular,
        }),
      ];

      const { caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity } =
        getDataForCalendaring({
          cases: mockCases,
        });

      // Act
      const { caseCountsAndSessionsByCity } = createProspectiveTrialSessions({
        calendaringConfig: mockCalendaringConfig,
        caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
        citiesFromLastTwoTerms: TRIAL_CITY_STRINGS,
      });

      // Assert
      expect(
        caseCountsAndSessionsByCity[mockRegularCityString].prospectiveSessions
          .length,
      ).toBeLessThanOrEqual(mockCalendaringConfig.regularCaseMaxQuantity);
    },
  );

  it(
    'should appropriately divide cases into regular, small, and hybrid ' +
      'sessions, and prioritizes small cases when all the cases are in one ' +
      'location and there are more small cases than regular',
    () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();

      const totalNumberOfRegularMockCases = Math.round(
        mockCalendaringConfig.regularCaseMaxQuantity +
          mockCalendaringConfig.hybridCaseMinimumQuantity / 2,
      );
      const totalNumberOfSmallMockCases = Math.round(
        mockCalendaringConfig.smallCaseMaxQuantity +
          mockCalendaringConfig.hybridCaseMinimumQuantity / 2,
      );

      const mockCases = [
        ...generateMockCases({
          city: mockRegularCityString,
          count: totalNumberOfRegularMockCases,
          procedureType: PROCEDURE_TYPES_MAP.regular,
        }),
        ...generateMockCases({
          city: mockRegularCityString,
          count: totalNumberOfSmallMockCases,
          procedureType: PROCEDURE_TYPES_MAP.small,
        }),
      ];

      const { caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity } =
        getDataForCalendaring({
          cases: mockCases,
        });

      // Act
      const { caseCountsAndSessionsByCity } = createProspectiveTrialSessions({
        calendaringConfig: mockCalendaringConfig,
        caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
        citiesFromLastTwoTerms: TRIAL_CITY_STRINGS,
      });

      // Assert
      expect(
        caseCountsAndSessionsByCity[mockRegularCityString]
          .prospectiveSessions[0].sessionType,
      ).toEqual(SESSION_TYPES.small);
      expect(
        caseCountsAndSessionsByCity[mockRegularCityString]
          .prospectiveSessions[1].sessionType,
      ).toEqual(SESSION_TYPES.regular);
      expect(
        caseCountsAndSessionsByCity[mockRegularCityString]
          .prospectiveSessions[2].sessionType,
      ).toEqual(SESSION_TYPES.hybrid);
    },
  );

  it('should add 2 hybrid to prospectiveSessions', () => {
    // Arrange
    const mockCalendaringConfig = getMockCalendaringConfig({
      hybridCaseMaxQuantity: 3,
      hybridCaseMinimumQuantity: 1,
      regularCaseMaxQuantity: 6,
      regularCaseMinimumQuantity: 5,
      smallCaseMaxQuantity: 6,
      smallCaseMinimumQuantity: 5,
    });

    const totalNumberOfRegularMockCases = 8;
    const totalNumberOfSmallMockCases = 8;

    const mockCases = [
      ...generateMockCases({
        city: mockRegularCityString,
        count: totalNumberOfRegularMockCases,
        procedureType: PROCEDURE_TYPES_MAP.regular,
      }),
      ...generateMockCases({
        city: mockRegularCityString,
        count: totalNumberOfSmallMockCases,
        procedureType: PROCEDURE_TYPES_MAP.small,
      }),
    ];

    const { caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity } =
      getDataForCalendaring({
        cases: mockCases,
      });

    // Act
    const { caseCountsAndSessionsByCity } = createProspectiveTrialSessions({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      citiesFromLastTwoTerms: TRIAL_CITY_STRINGS,
    });

    // Assert
    const SEESION_TYPES = caseCountsAndSessionsByCity[
      mockRegularCityString
    ].prospectiveSessions.map(ps => ps.sessionType);
    expect(SEESION_TYPES).toEqual([
      SESSION_TYPES.regular,
      SESSION_TYPES.small,
      SESSION_TYPES.hybrid,
      SESSION_TYPES.hybrid,
    ]);
  });

  it(
    'should appropriately divide cases into regular, small, and hybrid ' +
      'sessions, and prioritizes regular cases when all the cases are in one ' +
      'location and there are fewer small cases than regular',
    () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig({
        regularCaseMaxQuantity: 13,
        smallCaseMaxQuantity: 10,
      });

      const totalNumberOfRegularMockCases = Math.round(
        mockCalendaringConfig.regularCaseMaxQuantity +
          mockCalendaringConfig.hybridCaseMinimumQuantity / 2,
      );
      const totalNumberOfSmallMockCases = Math.round(
        mockCalendaringConfig.smallCaseMaxQuantity +
          mockCalendaringConfig.hybridCaseMinimumQuantity / 2,
      );

      const mockCases = [
        ...generateMockCases({
          city: mockRegularCityString,
          count: totalNumberOfRegularMockCases,
          procedureType: PROCEDURE_TYPES_MAP.regular,
        }),
        ...generateMockCases({
          city: mockRegularCityString,
          count: totalNumberOfSmallMockCases,
          procedureType: PROCEDURE_TYPES_MAP.small,
        }),
      ];

      const { caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity } =
        getDataForCalendaring({
          cases: mockCases,
        });

      // Act
      const { caseCountsAndSessionsByCity } = createProspectiveTrialSessions({
        calendaringConfig: mockCalendaringConfig,
        caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
        citiesFromLastTwoTerms: TRIAL_CITY_STRINGS,
      });

      // Assert
      expect(
        caseCountsAndSessionsByCity[mockRegularCityString]
          .prospectiveSessions[0].sessionType,
      ).toEqual(SESSION_TYPES.regular);
      expect(
        caseCountsAndSessionsByCity[mockRegularCityString]
          .prospectiveSessions[1].sessionType,
      ).toEqual(SESSION_TYPES.small);
      expect(
        caseCountsAndSessionsByCity[mockRegularCityString]
          .prospectiveSessions[2].sessionType,
      ).toEqual(SESSION_TYPES.hybrid);
    },
  );

  it('should schedule no regular sessions if the maximum set is to 0', () => {
    // Arrange
    const mockCalendaringConfig = getMockCalendaringConfig({
      regularCaseMaxQuantity: 0,
      smallCaseMaxQuantity: 10,
    });

    const totalNumberOfSmallMockCases = Math.round(
      mockCalendaringConfig.smallCaseMaxQuantity +
        mockCalendaringConfig.hybridCaseMinimumQuantity / 2,
    );
    const totalNumberOfRegularMockCases = totalNumberOfSmallMockCases;

    const mockCases = [
      ...generateMockCases({
        city: mockRegularCityString,
        count: totalNumberOfRegularMockCases,
        procedureType: PROCEDURE_TYPES_MAP.regular,
      }),
      ...generateMockCases({
        city: mockRegularCityString,
        count: totalNumberOfSmallMockCases,
        procedureType: PROCEDURE_TYPES_MAP.small,
      }),
    ];

    const { caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity } =
      getDataForCalendaring({
        cases: mockCases,
      });

    // Act
    const { caseCountsAndSessionsByCity } = createProspectiveTrialSessions({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      citiesFromLastTwoTerms: TRIAL_CITY_STRINGS,
    });

    // Assert

    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].prospectiveSessions[0]
        .sessionType,
    ).toEqual(SESSION_TYPES.small);
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].prospectiveSessions[1]
        .sessionType,
    ).toEqual(SESSION_TYPES.hybrid);
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].prospectiveSessions[2]
        .sessionType,
    ).toEqual(SESSION_TYPES.hybrid);
  });

  it('should schedule no sessions if all maximums are set to 0', () => {
    // Arrange
    const mockCalendaringConfig = getMockCalendaringConfig({
      regularCaseMaxQuantity: 0,
      smallCaseMaxQuantity: 0,
      hybridCaseMaxQuantity: 0,
    });

    const totalNumberOfSmallMockCases = 20;
    const totalNumberOfRegularMockCases = 20;

    const mockCases = [
      ...generateMockCases({
        city: mockRegularCityString,
        count: totalNumberOfRegularMockCases,
        procedureType: PROCEDURE_TYPES_MAP.regular,
      }),
      ...generateMockCases({
        city: mockRegularCityString,
        count: totalNumberOfSmallMockCases,
        procedureType: PROCEDURE_TYPES_MAP.small,
      }),
    ];

    const { caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity } =
      getDataForCalendaring({
        cases: mockCases,
      });

    // Act
    const { caseCountsAndSessionsByCity } = createProspectiveTrialSessions({
      calendaringConfig: mockCalendaringConfig,
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      citiesFromLastTwoTerms: TRIAL_CITY_STRINGS,
    });

    // Assert
    expect(
      caseCountsAndSessionsByCity[mockRegularCityString].prospectiveSessions,
    ).toEqual([]);
  });

  it(
    'should ignore regular case minimums and schedule a session for a ' +
      'location that has not been visited in the previous two terms',
    () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();

      const totalNumberOfMockCases =
        mockCalendaringConfig.maxSessionsPerLocation *
          mockCalendaringConfig.regularCaseMaxQuantity +
        mockCalendaringConfig.regularCaseMaxQuantity;

      const indexOfMockLowVolumeCityString = TRIAL_CITY_STRINGS.length - 2;
      const mockLowVolumeCityString =
        TRIAL_CITY_STRINGS[indexOfMockLowVolumeCityString];
      const mockTrialCitiesFromLastTwoTerms = [...TRIAL_CITY_STRINGS];
      mockTrialCitiesFromLastTwoTerms.splice(indexOfMockLowVolumeCityString, 1);

      const mockCases = [
        ...generateMockCases({
          city: mockRegularCityString,
          count: totalNumberOfMockCases,
          procedureType: PROCEDURE_TYPES_MAP.regular,
        }),
      ];

      mockCases.push({
        ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
        docketNumber: '999-24',
        preferredTrialCity: mockLowVolumeCityString,
        procedureType: PROCEDURE_TYPES_MAP.regular,
      });

      const { caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity } =
        getDataForCalendaring({
          cases: mockCases,
        });

      // Act
      const { caseCountsAndSessionsByCity } = createProspectiveTrialSessions({
        calendaringConfig: mockCalendaringConfig,
        caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
        citiesFromLastTwoTerms: mockTrialCitiesFromLastTwoTerms,
      });

      // Assert
      expect(
        caseCountsAndSessionsByCity[mockLowVolumeCityString].prospectiveSessions
          .length,
      ).toEqual(1);
      expect(
        caseCountsAndSessionsByCity[mockLowVolumeCityString]
          .prospectiveSessions[0].cityWasNotVisitedInLastTwoTerms,
      ).toEqual(true);
      expect(
        caseCountsAndSessionsByCity[mockLowVolumeCityString]
          .prospectiveSessions[0].sessionType,
      ).toEqual(SESSION_TYPES.regular);
    },
  );

  it(
    'should ignore small case minimums and schedule a session for a ' +
      'location that has not been visited in the previous two terms',
    () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();

      const totalNumberOfMockCases =
        mockCalendaringConfig.maxSessionsPerLocation *
          mockCalendaringConfig.smallCaseMaxQuantity +
        mockCalendaringConfig.smallCaseMaxQuantity;

      const indexOfMockLowVolumeCityString = TRIAL_CITY_STRINGS.length - 2;
      const mockLowVolumeCityString =
        TRIAL_CITY_STRINGS[indexOfMockLowVolumeCityString];
      const mockTrialCitiesFromLastTwoTerms = [...TRIAL_CITY_STRINGS];
      mockTrialCitiesFromLastTwoTerms.splice(indexOfMockLowVolumeCityString, 1);

      const mockCases = [
        ...generateMockCases({
          city: mockRegularCityString,
          count: totalNumberOfMockCases,
          procedureType: PROCEDURE_TYPES_MAP.small,
        }),
      ];

      mockCases.push({
        ...MOCK_CASE_READY_FOR_TRIAL_SESSION_SCHEDULING,
        docketNumber: '999-24',
        preferredTrialCity: mockLowVolumeCityString,
        procedureType: PROCEDURE_TYPES_MAP.small,
      });

      const { caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity } =
        getDataForCalendaring({
          cases: mockCases,
        });

      // Act
      const { caseCountsAndSessionsByCity } = createProspectiveTrialSessions({
        calendaringConfig: mockCalendaringConfig,
        caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
        citiesFromLastTwoTerms: mockTrialCitiesFromLastTwoTerms,
      });

      // Assert
      expect(
        caseCountsAndSessionsByCity[mockLowVolumeCityString].prospectiveSessions
          .length,
      ).toEqual(1);
      expect(
        caseCountsAndSessionsByCity[mockLowVolumeCityString]
          .prospectiveSessions[0].cityWasNotVisitedInLastTwoTerms,
      ).toEqual(true);
      expect(
        caseCountsAndSessionsByCity[mockLowVolumeCityString]
          .prospectiveSessions[0].sessionType,
      ).toEqual(SESSION_TYPES.small);
    },
  );

  it(
    'should ignore hybrid case minimums and schedule a session for a ' +
      'location that has not been visited in the previous two terms',
    () => {
      // Arrange
      const mockCalendaringConfig = getMockCalendaringConfig();

      const totalNumberOfMockCases =
        mockCalendaringConfig.maxSessionsPerLocation *
          mockCalendaringConfig.smallCaseMaxQuantity +
        mockCalendaringConfig.smallCaseMaxQuantity;

      const indexOfMockLowVolumeCityString = TRIAL_CITY_STRINGS.length - 2;
      const mockLowVolumeCityString =
        TRIAL_CITY_STRINGS[indexOfMockLowVolumeCityString];
      const mockTrialCitiesFromLastTwoTerms = [...TRIAL_CITY_STRINGS];
      mockTrialCitiesFromLastTwoTerms.splice(indexOfMockLowVolumeCityString, 1);

      const mockCases = [
        ...generateMockCases({
          city: mockRegularCityString,
          count: totalNumberOfMockCases,
          procedureType: PROCEDURE_TYPES_MAP.small,
        }),
      ];

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

      const { caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity } =
        getDataForCalendaring({
          cases: mockCases,
        });

      // Act
      const { caseCountsAndSessionsByCity } = createProspectiveTrialSessions({
        calendaringConfig: mockCalendaringConfig,
        caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
        citiesFromLastTwoTerms: mockTrialCitiesFromLastTwoTerms,
      });

      // Assert
      expect(
        caseCountsAndSessionsByCity[mockLowVolumeCityString].prospectiveSessions
          .length,
      ).toEqual(1);
      expect(
        caseCountsAndSessionsByCity[mockLowVolumeCityString]
          .prospectiveSessions[0].cityWasNotVisitedInLastTwoTerms,
      ).toEqual(true);
      expect(
        caseCountsAndSessionsByCity[mockLowVolumeCityString]
          .prospectiveSessions[0].sessionType,
      ).toEqual(SESSION_TYPES.hybrid);
    },
  );
});
