const { Statistic } = require('./Statistic');

describe('Statistic', () => {
  describe('validation', () => {
    it('fails validation if a yearOrPeriod is an invalid value', () => {
      const statistic = new Statistic({
        yearOrPeriod: 'something else',
      });
      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors())).toContain(
        'yearOrPeriod',
      );
    });

    it('passes validation with minimal required information', () => {
      const statistic = new Statistic({
        deficiencyAmount: 1,
        totalPenalties: 1,
        year: '2001',
        yearOrPeriod: 'Year',
      });
      expect(statistic.isValid()).toBeTruthy();
    });

    it('fails validation if a deficiencyAmount, totalPenalties, or year are not numbers', () => {
      const statistic = new Statistic({
        deficiencyAmount: 'something else',
        totalPenalties: 'something else',
        year: 'something else',
        yearOrPeriod: 'Year',
      });
      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors())).toEqual([
        'deficiencyAmount',
        'totalPenalties',
        'year',
      ]);
    });

    it('fails validation if a lastDateOfPeriod is a date in the future', () => {
      const statistic = new Statistic({
        deficiencyAmount: 1,
        lastDateOfPeriod: '2050-03-01T21:40:46.415Z',
        totalPenalties: 1,
        yearOrPeriod: 'Period',
      });
      expect(statistic.isValid()).toBeFalsy();
      expect(statistic.getFormattedValidationErrors()).toMatchObject({
        lastDateOfPeriod:
          Statistic.VALIDATION_ERROR_MESSAGES.lastDateOfPeriod[0].message,
      });
    });

    it('fails validation if a year is in the future', () => {
      const statistic = new Statistic({
        deficiencyAmount: 1,
        totalPenalties: 1,
        year: 2050,
        yearOrPeriod: 'Year',
      });
      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors())).toEqual([
        'year',
      ]);
    });

    it('passes validation with valid values', () => {
      const statistic = new Statistic({
        deficiencyAmount: 654.32,
        lastDateOfPeriod: '2015-03-01T21:40:46.415Z',
        totalPenalties: 123.45,
        year: 2015,
        yearOrPeriod: 'Year',
      });
      expect(statistic.isValid()).toBeTruthy();
    });
  });
});
