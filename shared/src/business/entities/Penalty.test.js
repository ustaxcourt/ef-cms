const { applicationContext } = require('../test/createTestApplicationContext');
const { Penalty } = require('./Penalty');

describe('Penalty', () => {
  it('throws an error if applicationContext is not provided on construction', () => {
    expect(() => new Penalty({}, {})).toThrow(
      'applicationContext must be defined',
    );
  });
  describe('validation', () => {
    let statisticId;
    beforeAll(() => {
      statisticId = '5666ad04-4814-4b0c-8090-ba01683917ac';
    });

    it('should fail if name is undefined', () => {
      const penalty = new Penalty(
        {
          amount: 100.0,
          name: undefined,
          statisticId,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBeFalsy();
      expect(Object.keys(penalty.getFormattedValidationErrors())).toContain(
        'name',
      );
    });

    it('should fail if amount is undefined', () => {
      const penalty = new Penalty(
        {
          amount: undefined,
          name: 'Penalty 1',
          statisticId,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBeFalsy();
      expect(Object.keys(penalty.getFormattedValidationErrors())).toContain(
        'amount',
      );
    });

    it('should fail if amount is not a number', () => {
      const penalty = new Penalty(
        {
          amount: 'something',
          name: 'Penalty 1',
          statisticId,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBeFalsy();
      expect(Object.keys(penalty.getFormattedValidationErrors())).toContain(
        'amount',
      );
    });

    it('should fail with statisticId undefined', () => {
      const penalty = new Penalty(
        {
          amount: 100.0,
          name: 'Penalty 1',
          statisticId: undefined,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBeFalsy();
      expect(Object.keys(penalty.getFormattedValidationErrors())).toContain(
        'statisticId',
      );
    });

    it('should pass with valid values', () => {
      const penalty = new Penalty(
        {
          amount: 100.0,
          name: 'Penalty 1',
          statisticId,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBeTruthy();
    });
  });
});
