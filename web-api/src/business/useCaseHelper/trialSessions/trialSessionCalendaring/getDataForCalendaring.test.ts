import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import { getDataForCalendaring } from './getDataForCalendaring';
import { v4 } from 'uuid';

const mockRegularCityString = TRIAL_CITY_STRINGS[TRIAL_CITY_STRINGS.length - 1];
const mockSpecialCityString = TRIAL_CITY_STRINGS[0];

const getMockCase = (overides = {}) => {
  return {
    docketNumber: v4(),
    preferredTrialCity: mockRegularCityString,
    procedureType: SESSION_TYPES.regular,
    ...overides,
  };
};

describe('getDataForCalendaring', () => {
  it(
    'should add a regular case with a small city as its preferred trial ' +
      'session location to the list of incorrectly sized regular cases',
    () => {
      // Arrange
      const mockCases = [
        getMockCase({
          preferredTrialCity: mockSpecialCityString,
        }),
      ];

      // Act
      const { incorrectSizeRegularCases } = getDataForCalendaring({
        cases: mockCases,
      });

      // Assert
      expect(incorrectSizeRegularCases).toContain(mockCases[0]);
    },
  );

  it(
    'should not add a regular case with a regular city as its preferred trial ' +
      'session location to the list of incorrectly sized regular cases',
    () => {
      // Arrange
      const mockCases = [getMockCase()];

      // Act
      const { incorrectSizeRegularCases } = getDataForCalendaring({
        cases: mockCases,
      });

      // Assert
      expect(incorrectSizeRegularCases.length).toEqual(0);
    },
  );
});
