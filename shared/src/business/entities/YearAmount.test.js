const YearAmount = require('./YearAmount');

describe('YearAmount', () => {
  describe('isValid - year', () => {
    it('returns false if a year is in the future', () => {
      expect(
        new YearAmount({
          year: new Date('9000-01-01').toISOString(),
          amount: 100,
        }).isValid(),
      ).toBeFalsy();
    });
  });

  describe('isValid - amount', () => {
    it('returns false if a number with a decimal point', () => {
      expect(
        new YearAmount({
          year: new Date('2000-01-01').toISOString(),
          amount: 100.94,
        }).isValid(),
      ).toBeFalsy();
    });

    it('returns false if the amount has a single decimal', () => {
      expect(
        new YearAmount({
          year: new Date('2000-01-01').toISOString(),
          amount: '100.94',
        }).isValid(),
      ).toBeFalsy();
    });

    it('returns false if the amount has a two decimals', () => {
      expect(
        new YearAmount({
          year: new Date('2000-01-01').toISOString(),
          amount: '100.94.32',
        }).isValid(),
      ).toBeFalsy();
    });

    it('returns false if the amount has a character in it', () => {
      expect(
        new YearAmount({
          year: new Date('2000-01-01').toISOString(),
          amount: '100x94.32',
        }).isValid(),
      ).toBeFalsy();
    });

    it('returns false if the amount has a comma', () => {
      expect(
        new YearAmount({
          year: new Date('2000-01-01').toISOString(),
          amount: '000,100',
        }).isValid(),
      ).toBeFalsy();
    });

    it('returns true if the amount is undefined', () => {
      expect(
        new YearAmount({
          year: new Date('2000-01-01').toISOString(),
        }).isValid(),
      ).toBeTruthy();
    });

    it('returns true if the amount is empty', () => {
      expect(
        new YearAmount({
          year: new Date('2000-01-01').toISOString(),
          amount: null,
        }).isValid(),
      ).toBeTruthy();
    });

    it('returns false if the year is undefined', () => {
      expect(
        new YearAmount({
          amount: 10,
        }).isValid(),
      ).toBeFalsy();
    });
  });
});
