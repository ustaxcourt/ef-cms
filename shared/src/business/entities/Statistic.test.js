const { applicationContext } = require('../test/createTestApplicationContext');
const { Statistic } = require('./Statistic');

describe('Statistic', () => {
  it('fails if applicationContext is not passed into the entity', async () => {
    let error;
    let statistic;

    try {
      statistic = new Statistic({
        yearOrPeriod: 'Year',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(statistic).toBeUndefined();
  });

  describe('validation', () => {
    it('fails validation if a yearOrPeriod is an invalid value', () => {
      const statistic = new Statistic(
        {
          yearOrPeriod: 'something else',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors())).toEqual([
        'yearOrPeriod',
      ]);
    });

    it('passes validation with minimal required information', () => {
      const statistic = new Statistic(
        {
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeTruthy();
    });

    it('fails validation if a deficiencyAmount or totalPenalties are not numbers', () => {
      const statistic = new Statistic(
        {
          deficiencyAmount: 'something else',
          totalPenalties: 'something else',
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors())).toEqual([
        'deficiencyAmount',
        'totalPenalties',
      ]);
    });

    it('fails validation if a lastDateOfPeriod is a date in the future', () => {
      const statistic = new Statistic(
        {
          lastDateOfPeriod: '2050-03-01T21:40:46.415Z',
          yearOrPeriod: 'Period',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeFalsy();
      expect(statistic.getFormattedValidationErrors()).toMatchObject({
        lastDateOfPeriod:
          Statistic.VALIDATION_ERROR_MESSAGES.lastDateOfPeriod[0].message,
      });
    });

    it('fails validation if a year is in the future', () => {
      const statistic = new Statistic(
        {
          year: 2050,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors())).toEqual([
        'year',
      ]);
    });

    it('passes validation with valid values', () => {
      const statistic = new Statistic(
        {
          deficiencyAmount: 654.32,
          lastDateOfPeriod: '2015-03-01T21:40:46.415Z',
          totalPenalties: 123.45,
          year: 2015,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeTruthy();
    });
  });
});
