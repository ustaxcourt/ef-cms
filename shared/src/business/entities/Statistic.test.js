const { applicationContext } = require('../test/createTestApplicationContext');
const { Statistic } = require('./Statistic');

describe('Statistic', () => {
  it('throws an error if applicationContext is not provided on construction', () => {
    expect(() => new Statistic({}, {})).toThrow(
      'applicationContext must be defined',
    );
  });
  describe('validation', () => {
    it('fails validation if a yearOrPeriod is an invalid value', () => {
      const statistic = new Statistic(
        {
          penalties: [{ irsPenaltyAmount: 100.0, name: 'Penalty1' }],
          yearOrPeriod: 'something else',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors())).toContain(
        'yearOrPeriod',
      );
    });

    it('passes validation with minimal required information', () => {
      const statistic = new Statistic(
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          penalties: [{ irsPenaltyAmount: 100.0, name: 'Penalty1' }],
          year: '2001',
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeTruthy();
    });

    it('fails validation if a irsDeficiencyAmount, irsTotalPenalties, or year are not numbers', () => {
      const statistic = new Statistic(
        {
          irsDeficiencyAmount: 'something else',
          irsTotalPenalties: 'something else',
          penalties: [{ irsPenaltyAmount: 100.0, name: 'Penalty1' }],
          year: 'something else',
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors())).toEqual([
        'irsDeficiencyAmount',
        'irsTotalPenalties',
        'year',
      ]);
    });

    it('fails validation if a lastDateOfPeriod is a date in the future', () => {
      const statistic = new Statistic(
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          lastDateOfPeriod: '2050-03-01T21:40:46.415Z',
          penalties: [{ irsPenaltyAmount: 100.0, name: 'Penalty1' }],
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
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          penalties: [{ irsPenaltyAmount: 100.0, name: 'Penalty1' }],
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
          irsDeficiencyAmount: 654.32,
          irsTotalPenalties: 123.45,
          lastDateOfPeriod: '2015-03-01T21:40:46.415Z',
          penalties: [{ irsPenaltyAmount: 100.0, name: 'Penalty1' }],
          year: 2015,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeTruthy();
    });

    it('requires determinationDeficiencyAmount be defined if determinationTotalPenalties is set', () => {
      const statistic = new Statistic(
        {
          determinationTotalPenalties: 100.11,
          irsDeficiencyAmount: 654.32,
          irsTotalPenalties: 123.45,
          lastDateOfPeriod: '2015-03-01T21:40:46.415Z',
          penalties: [{ irsPenaltyAmount: 100.0, name: 'Penalty1' }],
          year: 2015,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors())).toEqual([
        'determinationDeficiencyAmount',
      ]);
    });

    it('requires determinationTotalPenalties be defined if determinationDeficiencyAmount is set', () => {
      const statistic = new Statistic(
        {
          determinationDeficiencyAmount: 100.11,
          irsDeficiencyAmount: 654.32,
          irsTotalPenalties: 123.45,
          lastDateOfPeriod: '2015-03-01T21:40:46.415Z',
          penalties: [{ irsPenaltyAmount: 100.0, name: 'Penalty1' }],
          year: 2015,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors())).toEqual([
        'determinationTotalPenalties',
      ]);
    });
  });

  describe('addPenalty and updatePenalty', () => {
    let statistic;
    let statisticId = applicationContext.getUniqueId();
    let penaltyArrayLength;
    const MOCK_PENALTY_WITH_STATISTIC_ID = {
      entityName: 'Penalty',
      irsPenaltyAmount: 200,
      name: 'I am a penalty!',
      penaltyId: '081108f8-8b01-4e49-b437-781a581a16ac',
      statisticId,
    };
    const MOCK_PENALTY_WITHOUT_STATISTIC_ID = {
      entityName: 'Penalty',
      irsPenaltyAmount: 200,
      name: 'I am a penalty!',
      penaltyId: '081108f8-8b01-4e49-b437-781a581a16ac',
    };
    const MOCK_UPDATED_PENALTY = {
      entityName: 'Penalty',
      irsPenaltyAmount: 250,
      name: 'I am an updated penalty!',
      penaltyId: '123408f8-8b01-4e49-b437-123a581a12bb',
      statisticId,
    };

    beforeEach(() => {
      statistic = new Statistic(
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          penalties: [
            {
              irsPenaltyAmount: 100.0,
              name: 'Penalty 1',
              penaltyId: '123408f8-8b01-4e49-b437-123a581a12bb',
              statisticId,
            },
          ],
          statisticId,
          year: '2001',
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );
      penaltyArrayLength = statistic.penalties.length;
    });

    it('should add a penalty with a statistics id to the penalties array', () => {
      statistic.addPenalty({
        applicationContext,
        rawPenalty: MOCK_PENALTY_WITH_STATISTIC_ID,
      });
      expect(statistic.penalties.length).toEqual(penaltyArrayLength + 1);
      expect(statistic.penalties[1]).toEqual(MOCK_PENALTY_WITH_STATISTIC_ID);
    });

    it('should add a penalty without a statistics id to the penalties array', () => {
      statistic.addPenalty({
        applicationContext,
        rawPenalty: MOCK_PENALTY_WITHOUT_STATISTIC_ID,
      });

      expect(statistic.penalties.length).toEqual(penaltyArrayLength + 1);
      expect(statistic.penalties[1]).toEqual({
        ...MOCK_PENALTY_WITHOUT_STATISTIC_ID,
        statisticId,
      });
    });

    it('should update the penalty in the penalties array', () => {
      expect(statistic.penalties.length).toEqual(penaltyArrayLength);

      statistic.updatePenalty(MOCK_UPDATED_PENALTY);

      expect(statistic.penalties.length).toEqual(penaltyArrayLength);
      expect(statistic.penalties[0]).toEqual(MOCK_UPDATED_PENALTY);
    });
  });
});
