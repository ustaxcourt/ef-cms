import { Statistic } from './Statistic';
import { applicationContext } from '../test/createTestApplicationContext';

describe('Statistic', () => {
  it('throws an error if applicationContext is not provided on construction', () => {
    expect(() => new Statistic({}, {} as any)).toThrow(
      'applicationContext must be defined',
    );
  });

  describe('validation', () => {
    it("fails validation if a yearOrPeriod is not 'year' or 'period'", () => {
      const statistic = new Statistic(
        {
          penalties: [{ irsPenaltyAmount: 100.0, name: 'Penalty1' }],
          yearOrPeriod: 'something else',
        },
        { applicationContext },
      );

      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors()!)).toContain(
        'yearOrPeriod',
      );
    });

    it('passes validation with minimal required information', () => {
      const statistic = new Statistic(
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          penalties: [
            {
              name: 'Penalty 1(IRS)',
              penaltyAmount: 100.0,
              penaltyType: 'irsPenaltyAmount',
            },
          ],
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
          penalties: [
            {
              name: 'Penalty 1(IRS)',
              penaltyAmount: 100.0,
              penaltyType: 'irsPenaltyAmount',
            },
          ],
          year: 'something else',
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors()!)).toEqual([
        'irsDeficiencyAmount',
        'irsTotalPenalties',
        'year',
      ]);
    });

    it('should be invalid when one of the penalties in the statistic is NOT valid', () => {
      const statistic = new Statistic(
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          penalties: [
            {
              name: 'Penalty 1(IRS)',
              penaltyAmount: undefined, // This is a required field
              penaltyType: 'irsPenaltyAmount',
            },
          ],
          year: '2001',
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      expect(statistic.getFormattedValidationErrors()!).toEqual({
        penalties: [
          {
            index: 0,
            penaltyAmount: 'Enter penalty amount.',
          },
        ],
      });
    });

    it('should be invalid when one of the penalties in the statistic is NOT valid', () => {
      const statistic = new Statistic(
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          penalties: [
            {
              name: 'Penalty 1(IRS)',
              penaltyAmount: undefined, // This is a required field
              penaltyType: 'irsPenaltyAmount',
            },
          ],
          year: '2001',
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      expect(statistic.getFormattedValidationErrors()!).toEqual({
        penalties: [
          {
            index: 0,
            penaltyAmount: 'Enter penalty amount.',
          },
        ],
      });
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
        lastDateOfPeriod: 'Enter valid last date of period',
      });
    });

    it('fails validation if a year is in the future', () => {
      const statistic = new Statistic(
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          penalties: [
            {
              name: 'Penalty 1(IRS)',
              penaltyAmount: 100.0,
              penaltyType: 'irsPenaltyAmount',
            },
          ],
          year: 2050,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors()!)).toEqual([
        'year',
      ]);
    });

    it('passes validation with valid values', () => {
      const statistic = new Statistic(
        {
          irsDeficiencyAmount: 654.32,
          irsTotalPenalties: 123.45,
          lastDateOfPeriod: '2015-03-01T21:40:46.415Z',
          penalties: [
            {
              name: 'Penalty 1(IRS)',
              penaltyAmount: 100.0,
              penaltyType: 'irsPenaltyAmount',
            },
          ],
          year: 2015,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      expect(statistic.isValid()).toBeTruthy();
    });

    it('passes validation if an irsDeficiencyAmount, irsTotalPenalties, determinationTotalPenalties, and/or determinationDeficiencyAmount include negative numbers', () => {
      const statistic = new Statistic(
        {
          determinationDeficiencyAmount: -4352.32,
          determinationTotalPenalties: 0,
          irsDeficiencyAmount: -2.0,
          irsTotalPenalties: -222.22,
          penalties: [
            {
              name: 'Penalty 1(IRS)',
              penaltyAmount: -222.22,
              penaltyType: 'irsPenaltyAmount',
            },
          ],
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
          penalties: [
            {
              name: 'Penalty 1(IRS)',
              penaltyAmount: 100.0,
              penaltyType: 'irsPenaltyAmount',
            },
          ],
          year: 2015,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors()!)).toEqual([
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
          penalties: [
            {
              name: 'Penalty 1(IRS)',
              penaltyAmount: 100.0,
              penaltyType: 'irsPenaltyAmount',
            },
          ],
          year: 2015,
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      expect(statistic.isValid()).toBeFalsy();
      expect(Object.keys(statistic.getFormattedValidationErrors()!)).toEqual([
        'determinationTotalPenalties',
      ]);
    });
  });

  describe('Penalties', () => {
    let statistic;
    let statisticId = applicationContext.getUniqueId();
    let penaltyArrayLength;
    const MOCK_PENALTY_WITH_STATISTIC_ID = {
      entityName: 'Penalty',
      name: 'Penalty 1 (IRS)',
      penaltyAmount: 200,
      penaltyId: '081108f8-8b01-4e49-b437-781a581a16ac',
      penaltyType: 'irsPenaltyAmount',
      statisticId,
    };
    const MOCK_PENALTY_WITHOUT_STATISTIC_ID = {
      entityName: 'Penalty',
      name: 'Penalty 1 (Court)',
      penaltyAmount: 200,
      penaltyId: '081108f8-8b01-4e49-b437-781a581a16ac',
      penaltyType: 'determinationPenaltyAmount',
    };
    const MOCK_UPDATED_PENALTY = {
      entityName: 'Penalty',
      name: 'I am an updated penalty!',
      penaltyAmount: 250,
      penaltyId: '123408f8-8b01-4e49-b437-123a581a12bb',
      penaltyType: 'irsPenaltyAmount',
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

    it('should add a penalty without a statistics id to the penalties array and add the parent statisticId to the penalty', () => {
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

    it('should itemize both determinationTotalPenalties and irsTotalPenalties created prior to penalty itemization', () => {
      const preItemizationStatistic = new Statistic(
        {
          determinationTotalPenalties: 3000,
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 2000,
          statisticId,
          year: '2001',
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      const expectedPenalties = [
        {
          entityName: 'Penalty',
          name: 'Penalty 1 (IRS)',
          penaltyAmount: 2000,
          penaltyType: 'irsPenaltyAmount',
          statisticId,
        },
        {
          entityName: 'Penalty',
          name: 'Penalty 1 (Court)',
          penaltyAmount: 3000,
          penaltyType: 'determinationPenaltyAmount',
          statisticId,
        },
      ];

      expect(preItemizationStatistic.penalties).toEqual([
        expect.objectContaining(expectedPenalties[0]),
        expect.objectContaining(expectedPenalties[1]),
      ]);
    });

    it('should itemize only irsTotalPenalties created prior to penalty itemization, if determinationTotalPenalties does not exist', () => {
      const preItemizationStatistic = new Statistic(
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 2000,
          statisticId,
          year: '2001',
          yearOrPeriod: 'Year',
        },
        { applicationContext },
      );

      const expectedPenalties = [
        {
          entityName: 'Penalty',
          name: 'Penalty 1 (IRS)',
          penaltyAmount: 2000,
          penaltyType: 'irsPenaltyAmount',
          statisticId,
        },
      ];

      expect(preItemizationStatistic.penalties).toEqual([
        expect.objectContaining(expectedPenalties[0]),
      ]);
    });
  });
});
