/* eslint-disable custom-rules-plugin/no-new-dates */
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { sortStatistics } from '@web-api/persistence/postgres/cases/statistics/helper';
import { CaseStatisticKysely } from '@web-api/persistence/postgres/cases/statistics/schema';

describe('DB statistics helper', () => {
  const dbStatistic: CaseStatisticKysely = {
    determinationDeficiencyAmount: undefined,
    determinationTotalPenalties: undefined,
    docketNumber: '105-20',
    irsDeficiencyAmount: '5678',
    irsTotalPenalties: '1234',
    lastDateOfPeriod: undefined,
    statisticId: 'cb557361-50ee-4440-aaff-0a9f1bfa30ed',
    year: 2018,
    yearOrPeriod: 'Year',
    updatedAt: calculateDate({ dateString: formatNow() }),
  };

  describe('primary sort', () => {
    it('should sort by year as a primary sort from oldest to newest', () => {
      const statistics: CaseStatisticKysely[] = [
        { ...dbStatistic, year: 2030 },
        { ...dbStatistic, year: 2019 },
        { ...dbStatistic, year: 1999 },
      ];
      const actualStatistics = sortStatistics(statistics);

      expect(actualStatistics[0].year).toEqual(1999);
      expect(actualStatistics[1].year).toEqual(2019);
      expect(actualStatistics[2].year).toEqual(2030);
    });

    it('should sort by lastDateOfPeriod as a primary sort from oldest to newest', () => {
      const expectedFirst = new Date('2023-11-07T11:01:51.621Z');
      const expectedSecond = new Date('2023-12-07T11:01:51.621Z');
      const expectedThird = new Date('2023-12-07T11:02:51.621Z');
      const statistics: CaseStatisticKysely[] = [
        {
          ...dbStatistic,
          year: null,
          lastDateOfPeriod: expectedThird,
        },
        {
          ...dbStatistic,
          year: null,
          lastDateOfPeriod: expectedSecond,
        },
        {
          ...dbStatistic,
          year: null,
          lastDateOfPeriod: expectedFirst,
        },
      ];
      const actualStatistics = sortStatistics(statistics);

      expect(actualStatistics[0].lastDateOfPeriod).toEqual(expectedFirst);
      expect(actualStatistics[1].lastDateOfPeriod).toEqual(expectedSecond);
      expect(actualStatistics[2].lastDateOfPeriod).toEqual(expectedThird);
    });

    it('should sort by year and lastDateOfPeriod as a primary sort from oldest to newest (one of year or lastDateOfPeriod will always be defined, but not both)', () => {
      const expectedFirst = '101-20';
      const expectedSecond = '102-20';
      const expectedThird = '103-20';
      const expectedFourth = '104-20';
      const statistics: CaseStatisticKysely[] = [
        {
          ...dbStatistic,
          docketNumber: expectedFourth,
          year: null,
          lastDateOfPeriod: new Date('2024-03-07T11:02:51.621Z'),
        },
        {
          ...dbStatistic,
          docketNumber: expectedThird,
          year: 2024,
        },
        {
          ...dbStatistic,
          docketNumber: expectedFirst,
          year: 2023,
        },
        {
          ...dbStatistic,
          docketNumber: expectedSecond,
          year: null,
          lastDateOfPeriod: new Date('2023-03-01T11:02:51.621Z'),
        },
      ];
      const actualStatistics = sortStatistics(statistics);

      expect(actualStatistics[0].docketNumber).toEqual(expectedFirst);
      expect(actualStatistics[1].docketNumber).toEqual(expectedSecond);
      expect(actualStatistics[2].docketNumber).toEqual(expectedThird);
      expect(actualStatistics[3].docketNumber).toEqual(expectedFourth);
    });
  });

  describe('secondary sort', () => {
    it('should sort by updatedAt from newest to oldest as a secondary sort when year is identical', () => {
      const expectedFirst = new Date('2023-12-07T11:02:51.621Z');
      const expectedSecond = new Date('2023-12-07T11:01:51.621Z');
      const expectedThird = new Date('2023-11-07T11:01:51.621Z');
      const statistics: CaseStatisticKysely[] = [
        {
          ...dbStatistic,
          year: 2030,
          updatedAt: expectedSecond,
        },
        {
          ...dbStatistic,
          year: 2030,
          updatedAt: expectedThird,
        },
        {
          ...dbStatistic,
          year: 2030,
          updatedAt: expectedFirst,
        },
      ];
      const actualStatistics = sortStatistics(statistics);

      expect(actualStatistics[0].updatedAt).toEqual(expectedFirst);
      expect(actualStatistics[1].updatedAt).toEqual(expectedSecond);
      expect(actualStatistics[2].updatedAt).toEqual(expectedThird);
    });

    it('should sort by updatedAt from newest to oldest as a secondary sort when lastDateOfPeriod is identical', () => {
      const expectedFirst = new Date('2023-12-07T11:02:51.621Z');
      const expectedSecond = new Date('2023-12-07T11:01:51.621Z');
      const expectedThird = new Date('2023-11-07T11:01:51.621Z');
      const lastDateOfPeriod = new Date('2023-11-07T11:01:51.621Z');
      const statistics: CaseStatisticKysely[] = [
        {
          ...dbStatistic,
          lastDateOfPeriod,
          updatedAt: expectedSecond,
        },
        {
          ...dbStatistic,
          lastDateOfPeriod,
          updatedAt: expectedThird,
        },
        {
          ...dbStatistic,
          lastDateOfPeriod,
          updatedAt: expectedFirst,
        },
      ];
      const actualStatistics = sortStatistics(statistics);

      expect(actualStatistics[0].updatedAt).toEqual(expectedFirst);
      expect(actualStatistics[1].updatedAt).toEqual(expectedSecond);
      expect(actualStatistics[2].updatedAt).toEqual(expectedThird);
    });
  });
});
