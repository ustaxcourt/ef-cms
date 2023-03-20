const { applicationContext } = require('../test/createTestApplicationContext');
const { Penalty } = require('./Penalty');
const { PENALTY_TYPES } = require('./EntityConstants');

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
          irsPenaltyAmount: 100.0,
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

    it('should fail if penaltyAmount is undefined', () => {
      const penalty = new Penalty(
        {
          name: 'Penalty 1 (IRS)',
          penaltyAmount: undefined,
          penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBe(false);
      expect(Object.keys(penalty.getFormattedValidationErrors())).toContain(
        'penaltyAmount',
      );
    });

    it('should fail if penaltyAmount is not a number', () => {
      const penalty = new Penalty(
        {
          name: 'Penalty 1 (IRS)',
          penaltyAmount: 'something',
          penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBe(false);
      expect(Object.keys(penalty.getFormattedValidationErrors())).toContain(
        'penaltyAmount',
      );
    });

    it('should fail if penaltyAmount is a negative number', () => {
      const penalty = new Penalty(
        {
          name: 'Penalty 1 (IRS)',
          penaltyAmount: -422.68,
          penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBe(false);
      expect(Object.keys(penalty.getFormattedValidationErrors())).toContain(
        'penaltyAmount',
      );
    });

    it('should fail if penaltyType is undefined', () => {
      const penalty = new Penalty(
        {
          name: 'Penalty 1 (IRS)',
          penaltyAmount: 100.0,
          penaltyType: undefined,
          statisticId,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBe(false);
      expect(Object.keys(penalty.getFormattedValidationErrors())).toContain(
        'penaltyType',
      );
    });

    it('should fail with statisticId undefined', () => {
      const penalty = new Penalty(
        {
          name: 'Penalty 1 (IRS)',
          penaltyAmount: 100.0,
          penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId: undefined,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBe(false);
      expect(Object.keys(penalty.getFormattedValidationErrors())).toContain(
        'statisticId',
      );
    });

    it('should pass with valid values and irsPenaltyAmount type', () => {
      const penalty = new Penalty(
        {
          name: 'Penalty 1 (IRS)',
          penaltyAmount: 100.0,
          penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBe(true);
    });

    it('should pass with valid values and determinationPenaltyAmount type', () => {
      const penalty = new Penalty(
        {
          name: 'Penalty 1 (Court)',
          penaltyAmount: 100.0,
          penaltyType: PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
          statisticId,
        },
        { applicationContext },
      );

      expect(penalty.isValid()).toBe(true);
    });
  });
});
