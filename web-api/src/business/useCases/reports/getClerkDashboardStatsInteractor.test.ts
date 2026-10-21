/* eslint-disable max-lines */
import {
  Month,
  getClerkDashboardStatsInteractor,
} from './getClerkDashboardStatsInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats',
  () => ({
    caseStatusChangesByYear: jest.fn(),
    openCasesByCaseType: jest.fn(),
    openCasesByProcedureType: jest.fn(),
    petitionsDataByYear: jest.fn(),
  }),
);

jest.mock('@shared/business/utilities/DateHandler', () => ({
  ...jest.requireActual('@shared/business/utilities/DateHandler'),
  createISODateString: jest.fn(),
}));

import {
  caseStatusChangesByYear,
  openCasesByCaseType,
  openCasesByProcedureType,
  petitionsDataByYear,
} from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import {
  CASE_TYPES,
  FISCAL_MONTH_LABELS,
  MONTH_LABELS,
} from '@shared/business/entities/EntityConstants';

const toMonths = (labels: string[]): Month[] =>
  labels.map(label => Month[label as keyof typeof Month]);
const CALENDAR_MONTHS = toMonths(MONTH_LABELS);
const FISCAL_MONTHS = toMonths(FISCAL_MONTH_LABELS);

describe('getClerkDashboardStatsInteractor', () => {
  const mockStats = [
    { isPaper: false, isRepresenting: null, month: '10', total: '759' },
    { isPaper: true, isRepresenting: null, month: '12', total: '261' },
    { isPaper: true, isRepresenting: null, month: '4', total: '234' },
    { isPaper: true, isRepresenting: null, month: '6', total: '27' },
    { isPaper: false, isRepresenting: null, month: '4', total: '708' },
    { isPaper: false, isRepresenting: null, month: '3', total: '721' },
    { isPaper: true, isRepresenting: null, month: '5', total: '267' },
    { isPaper: true, isRepresenting: null, month: '1', total: '158' },
    { isPaper: false, isRepresenting: null, month: '6', total: '222' },
    { isPaper: true, isRepresenting: null, month: '3', total: '260' },
    { isPaper: true, isRepresenting: null, month: '2', total: '165' },
    { isPaper: false, isRepresenting: null, month: '1', total: '421' },
    { isPaper: false, isRepresenting: null, month: '12', total: '627' },
    { isPaper: true, isRepresenting: null, month: '11', total: '217' },
    { isPaper: true, isRepresenting: null, month: '10', total: '354' },
    { isPaper: false, isRepresenting: null, month: '2', total: '510' },
    { isPaper: false, isRepresenting: null, month: '5', total: '873' },
    { isPaper: false, isRepresenting: null, month: '11', total: '627' },
    { isPaper: false, isRepresenting: null, month: null, total: '5468' },
    { isPaper: true, isRepresenting: null, month: null, total: '1943' },
    { isPaper: null, isRepresenting: false, month: null, total: '5520' },
    { isPaper: null, isRepresenting: true, month: null, total: '1891' },
  ];

  beforeEach(() => {
    (petitionsDataByYear as jest.Mock).mockResolvedValue(mockStats);
    (openCasesByProcedureType as jest.Mock).mockResolvedValue([]);
    (openCasesByCaseType as jest.Mock).mockResolvedValue([]);
    (caseStatusChangesByYear as jest.Mock).mockResolvedValue([]);
    (createISODateString as jest.Mock).mockReturnValue(
      '2026-02-01T00:00:00.000Z',
    );
  });

  it('should throw an unauthorized error when the user does not have access', async () => {
    await expect(
      getClerkDashboardStatsInteractor(mockPetitionerUser),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return full petitions data by both calendar and fiscal year', async () => {
    (petitionsDataByYear as jest.Mock).mockResolvedValueOnce([
      { isPaper: false, isRepresenting: null, month: '10', total: '1050' },
      { isPaper: true, isRepresenting: null, month: '12', total: '1200' },
      { isPaper: true, isRepresenting: null, month: '4', total: '400' },
      { isPaper: true, isRepresenting: null, month: '6', total: '600' },
      { isPaper: false, isRepresenting: null, month: '4', total: '450' },
      { isPaper: false, isRepresenting: null, month: '3', total: '350' },
      { isPaper: true, isRepresenting: null, month: '5', total: '500' },
      { isPaper: true, isRepresenting: null, month: '1', total: '100' },
      { isPaper: false, isRepresenting: null, month: '6', total: '650' },
      { isPaper: true, isRepresenting: null, month: '3', total: '300' },
      { isPaper: true, isRepresenting: null, month: '2', total: '200' },
      { isPaper: false, isRepresenting: null, month: '1', total: '150' },
      { isPaper: false, isRepresenting: null, month: '12', total: '1250' },
      { isPaper: true, isRepresenting: null, month: '11', total: '1100' },
      { isPaper: true, isRepresenting: null, month: '10', total: '1000' },
      { isPaper: false, isRepresenting: null, month: '2', total: '250' },
      { isPaper: false, isRepresenting: null, month: '5', total: '550' },
      { isPaper: true, isRepresenting: null, month: '7', total: '700' },
      { isPaper: false, isRepresenting: null, month: '7', total: '750' },
      { isPaper: true, isRepresenting: null, month: '8', total: '800' },
      { isPaper: false, isRepresenting: null, month: '8', total: '850' },
      { isPaper: true, isRepresenting: null, month: '9', total: '900' },
      { isPaper: false, isRepresenting: null, month: '9', total: '950' },
      { isPaper: false, isRepresenting: null, month: '11', total: '1150' },
      { isPaper: false, isRepresenting: null, month: null, total: '8400' },
      { isPaper: true, isRepresenting: null, month: null, total: '7800' },
      { isPaper: null, isRepresenting: false, month: null, total: '10200' },
      { isPaper: null, isRepresenting: true, month: null, total: '6000' },
    ]);
    (petitionsDataByYear as jest.Mock).mockResolvedValueOnce([
      { isPaper: false, isRepresenting: null, month: '10', total: '1550' },
      { isPaper: true, isRepresenting: null, month: '12', total: '1700' },
      { isPaper: true, isRepresenting: null, month: '4', total: '400' },
      { isPaper: true, isRepresenting: null, month: '6', total: '600' },
      { isPaper: false, isRepresenting: null, month: '4', total: '450' },
      { isPaper: false, isRepresenting: null, month: '3', total: '350' },
      { isPaper: true, isRepresenting: null, month: '5', total: '500' },
      { isPaper: true, isRepresenting: null, month: '1', total: '100' },
      { isPaper: false, isRepresenting: null, month: '6', total: '650' },
      { isPaper: true, isRepresenting: null, month: '3', total: '300' },
      { isPaper: true, isRepresenting: null, month: '2', total: '200' },
      { isPaper: false, isRepresenting: null, month: '1', total: '150' },
      { isPaper: false, isRepresenting: null, month: '12', total: '1750' },
      { isPaper: true, isRepresenting: null, month: '11', total: '1600' },
      { isPaper: true, isRepresenting: null, month: '10', total: '1500' },
      { isPaper: false, isRepresenting: null, month: '2', total: '250' },
      { isPaper: false, isRepresenting: null, month: '5', total: '550' },
      { isPaper: true, isRepresenting: null, month: '7', total: '700' },
      { isPaper: false, isRepresenting: null, month: '7', total: '750' },
      { isPaper: true, isRepresenting: null, month: '8', total: '800' },
      { isPaper: false, isRepresenting: null, month: '8', total: '850' },
      { isPaper: true, isRepresenting: null, month: '9', total: '900' },
      { isPaper: false, isRepresenting: null, month: '9', total: '950' },
      { isPaper: false, isRepresenting: null, month: '11', total: '1650' },
      { isPaper: false, isRepresenting: null, month: null, total: '9900' },
      { isPaper: true, isRepresenting: null, month: null, total: '9300' },
      { isPaper: null, isRepresenting: false, month: null, total: '11200' },
      { isPaper: null, isRepresenting: true, month: null, total: '8000' },
    ]);

    const result = await getClerkDashboardStatsInteractor(mockDocketClerkUser);

    expect(result).toMatchObject({
      year: '2026',
      fiscalYear: '2026',
      calendarYearPetitionStats: {
        petitionFullPaperMonths: [
          {
            month: 1,
            isPaper: true,
            total: 100,
          },
          {
            month: 2,
            isPaper: true,
            total: 200,
          },
          {
            month: 3,
            isPaper: true,
            total: 300,
          },
          {
            month: 4,
            isPaper: true,
            total: 400,
          },
          {
            month: 5,
            isPaper: true,
            total: 500,
          },
          {
            month: 6,
            isPaper: true,
            total: 600,
          },
          {
            month: 7,
            isPaper: true,
            total: 700,
          },
          {
            month: 8,
            isPaper: true,
            total: 800,
          },
          {
            month: 9,
            isPaper: true,
            total: 900,
          },
          {
            month: 10,
            isPaper: true,
            total: 1000,
          },
          {
            month: 11,
            isPaper: true,
            total: 1100,
          },
          {
            month: 12,
            isPaper: true,
            total: 1200,
          },
        ],
        petitionFullElectronicMonths: [
          {
            month: 1,
            isPaper: false,
            total: 150,
          },
          {
            month: 2,
            isPaper: false,
            total: 250,
          },
          {
            month: 3,
            isPaper: false,
            total: 350,
          },
          {
            month: 4,
            isPaper: false,
            total: 450,
          },
          {
            month: 5,
            isPaper: false,
            total: 550,
          },
          {
            month: 6,
            isPaper: false,
            total: 650,
          },
          {
            month: 7,
            isPaper: false,
            total: 750,
          },
          {
            month: 8,
            isPaper: false,
            total: 850,
          },
          {
            month: 9,
            isPaper: false,
            total: 950,
          },
          {
            month: 10,
            isPaper: false,
            total: 1050,
          },
          {
            month: 11,
            isPaper: false,
            total: 1150,
          },
          {
            month: 12,
            isPaper: false,
            total: 1250,
          },
        ],
        petitionsByServiceType: [
          {
            total: 8400,
            isPaper: false,
          },
          {
            total: 7800,
            isPaper: true,
          },
        ],
        petitionsByRepresentation: [
          {
            total: 10200,
            isRepresenting: false,
          },
          {
            total: 6000,
            isRepresenting: true,
          },
        ],
      },
      fiscalYearPetitionStats: {
        petitionFullPaperMonths: [
          {
            month: 10,
            isPaper: true,
            total: 1500,
          },
          {
            month: 11,
            isPaper: true,
            total: 1600,
          },
          {
            month: 12,
            isPaper: true,
            total: 1700,
          },
          {
            month: 1,
            isPaper: true,
            total: 100,
          },
          {
            month: 2,
            isPaper: true,
            total: 200,
          },
          {
            month: 3,
            isPaper: true,
            total: 300,
          },
          {
            month: 4,
            isPaper: true,
            total: 400,
          },
          {
            month: 5,
            isPaper: true,
            total: 500,
          },
          {
            month: 6,
            isPaper: true,
            total: 600,
          },
          {
            month: 7,
            isPaper: true,
            total: 700,
          },
          {
            month: 8,
            isPaper: true,
            total: 800,
          },
          {
            month: 9,
            isPaper: true,
            total: 900,
          },
        ],
        petitionFullElectronicMonths: [
          {
            month: 10,
            isPaper: false,
            total: 1550,
          },
          {
            month: 11,
            isPaper: false,
            total: 1650,
          },
          {
            month: 12,
            isPaper: false,
            total: 1750,
          },
          {
            month: 1,
            isPaper: false,
            total: 150,
          },
          {
            month: 2,
            isPaper: false,
            total: 250,
          },
          {
            month: 3,
            isPaper: false,
            total: 350,
          },
          {
            month: 4,
            isPaper: false,
            total: 450,
          },
          {
            month: 5,
            isPaper: false,
            total: 550,
          },
          {
            month: 6,
            isPaper: false,
            total: 650,
          },
          {
            month: 7,
            isPaper: false,
            total: 750,
          },
          {
            month: 8,
            isPaper: false,
            total: 850,
          },
          {
            month: 9,
            isPaper: false,
            total: 950,
          },
        ],
        petitionsByServiceType: [
          {
            total: 9900,
            isPaper: false,
          },
          {
            total: 9300,
            isPaper: true,
          },
        ],
        petitionsByRepresentation: [
          {
            total: 11200,
            isRepresenting: false,
          },
          {
            total: 8000,
            isRepresenting: true,
          },
        ],
      },
    });
  });

  it('should handle months with no petitions', async () => {
    (petitionsDataByYear as jest.Mock).mockResolvedValue([
      { isPaper: true, isRepresenting: null, month: '1', total: '100' },
      { isPaper: true, isRepresenting: null, month: '2', total: '200' },
      { isPaper: true, isRepresenting: null, month: '3', total: '300' },
      { isPaper: false, isRepresenting: null, month: '4', total: '450' },
      { isPaper: false, isRepresenting: null, month: '5', total: '550' },
      { isPaper: false, isRepresenting: null, month: '6', total: '650' },
      { isPaper: true, isRepresenting: null, month: '7', total: '700' },
      { isPaper: false, isRepresenting: null, month: '7', total: '750' },
      { isPaper: true, isRepresenting: null, month: '8', total: '800' },
      { isPaper: false, isRepresenting: null, month: '8', total: '850' },
      { isPaper: true, isRepresenting: null, month: '9', total: '900' },
      { isPaper: false, isRepresenting: null, month: '9', total: '950' },
      { isPaper: false, isRepresenting: null, month: null, total: '4200' },
      { isPaper: true, isRepresenting: null, month: null, total: '3000' },
      { isPaper: null, isRepresenting: false, month: null, total: '5000' },
      { isPaper: null, isRepresenting: true, month: null, total: '2200' },
    ]);
    const result = await getClerkDashboardStatsInteractor(mockDocketClerkUser);

    expect(result.calendarYearPetitionStats).toEqual({
      petitionFullPaperMonths: [
        {
          month: 1,
          isPaper: true,
          total: 100,
        },
        {
          month: 2,
          isPaper: true,
          total: 200,
        },
        {
          month: 3,
          isPaper: true,
          total: 300,
        },
        {
          month: 4,
          isPaper: true,
          total: 0,
        },
        {
          month: 5,
          isPaper: true,
          total: 0,
        },
        {
          month: 6,
          isPaper: true,
          total: 0,
        },
        {
          month: 7,
          isPaper: true,
          total: 700,
        },
        {
          month: 8,
          isPaper: true,
          total: 800,
        },
        {
          month: 9,
          isPaper: true,
          total: 900,
        },
        {
          month: 10,
          isPaper: true,
          total: 0,
        },
        {
          month: 11,
          isPaper: true,
          total: 0,
        },
        {
          month: 12,
          isPaper: true,
          total: 0,
        },
      ],
      petitionFullElectronicMonths: [
        {
          month: 1,
          isPaper: false,
          total: 0,
        },
        {
          month: 2,
          isPaper: false,
          total: 0,
        },
        {
          month: 3,
          isPaper: false,
          total: 0,
        },
        {
          month: 4,
          isPaper: false,
          total: 450,
        },
        {
          month: 5,
          isPaper: false,
          total: 550,
        },
        {
          month: 6,
          isPaper: false,
          total: 650,
        },
        {
          month: 7,
          isPaper: false,
          total: 750,
        },
        {
          month: 8,
          isPaper: false,
          total: 850,
        },
        {
          month: 9,
          isPaper: false,
          total: 950,
        },
        {
          month: 10,
          isPaper: false,
          total: 0,
        },
        {
          month: 11,
          isPaper: false,
          total: 0,
        },
        {
          month: 12,
          isPaper: false,
          total: 0,
        },
      ],
      petitionsByServiceType: [
        {
          total: 4200,
          isPaper: false,
        },
        {
          total: 3000,
          isPaper: true,
        },
      ],
      petitionsByRepresentation: [
        {
          total: 5000,
          isRepresenting: false,
        },
        {
          total: 2200,
          isRepresenting: true,
        },
      ],
    });
  });

  it('should handle no data for the year', async () => {
    (petitionsDataByYear as jest.Mock).mockResolvedValue([]);

    const result = await getClerkDashboardStatsInteractor(mockDocketClerkUser);

    expect(result.calendarYearPetitionStats).toEqual({
      petitionFullPaperMonths: [
        {
          month: 1,
          isPaper: true,
          total: 0,
        },
        {
          month: 2,
          isPaper: true,
          total: 0,
        },
        {
          month: 3,
          isPaper: true,
          total: 0,
        },
        {
          month: 4,
          isPaper: true,
          total: 0,
        },
        {
          month: 5,
          isPaper: true,
          total: 0,
        },
        {
          month: 6,
          isPaper: true,
          total: 0,
        },
        {
          month: 7,
          isPaper: true,
          total: 0,
        },
        {
          month: 8,
          isPaper: true,
          total: 0,
        },
        {
          month: 9,
          isPaper: true,
          total: 0,
        },
        {
          month: 10,
          isPaper: true,
          total: 0,
        },
        {
          month: 11,
          isPaper: true,
          total: 0,
        },
        {
          month: 12,
          isPaper: true,
          total: 0,
        },
      ],
      petitionFullElectronicMonths: [
        {
          month: 1,
          isPaper: false,
          total: 0,
        },
        {
          month: 2,
          isPaper: false,
          total: 0,
        },
        {
          month: 3,
          isPaper: false,
          total: 0,
        },
        {
          month: 4,
          isPaper: false,
          total: 0,
        },
        {
          month: 5,
          isPaper: false,
          total: 0,
        },
        {
          month: 6,
          isPaper: false,
          total: 0,
        },
        {
          month: 7,
          isPaper: false,
          total: 0,
        },
        {
          month: 8,
          isPaper: false,
          total: 0,
        },
        {
          month: 9,
          isPaper: false,
          total: 0,
        },
        {
          month: 10,
          isPaper: false,
          total: 0,
        },
        {
          month: 11,
          isPaper: false,
          total: 0,
        },
        {
          month: 12,
          isPaper: false,
          total: 0,
        },
      ],
      petitionsByServiceType: [],
      petitionsByRepresentation: [],
    });
  });
  describe('cases', () => {
    it('should return open cases by procedure type in Regular, Small order', async () => {
      (openCasesByProcedureType as jest.Mock).mockResolvedValue([
        { procedureType: 'Small', total: '5591' },
        { procedureType: 'Regular', total: '14216' },
      ]);

      const result =
        await getClerkDashboardStatsInteractor(mockDocketClerkUser);

      expect(result.openCasesByProcedureType).toEqual([
        { procedureType: 'Regular', total: 14216 },
        { procedureType: 'Small', total: 5591 },
      ]);
    });

    it('should default missing procedure types to zero', async () => {
      (openCasesByProcedureType as jest.Mock).mockResolvedValue([
        { procedureType: 'Regular', total: '12' },
      ]);

      const result =
        await getClerkDashboardStatsInteractor(mockDocketClerkUser);

      expect(result.openCasesByProcedureType).toEqual([
        { procedureType: 'Regular', total: 12 },
        { procedureType: 'Small', total: 0 },
      ]);
    });

    it('should return open cases for every case type, defaulting missing case types to zero', async () => {
      (openCasesByCaseType as jest.Mock).mockResolvedValue([
        { caseType: 'Deficiency', total: '1798' },
        { caseType: 'Partnership (Section 6226)', total: '48' },
      ]);

      const result =
        await getClerkDashboardStatsInteractor(mockDocketClerkUser);

      expect(result.openCasesByCaseType).toHaveLength(CASE_TYPES.length);
      expect(result.openCasesByCaseType).toEqual(
        expect.arrayContaining([
          { caseType: 'Deficiency', total: 1798 },
          { caseType: 'Partnership (Section 6226)', total: 48 },
          { caseType: 'Passport', total: 0 },
        ]),
      );
    });

    it('should return open cases by case type in CASE_TYPES order', async () => {
      const result =
        await getClerkDashboardStatsInteractor(mockDocketClerkUser);

      expect(result.openCasesByCaseType.map(c => c.caseType)).toEqual(
        CASE_TYPES,
      );
    });

    it('should query case status changes for the calendar and fiscal year', async () => {
      await getClerkDashboardStatsInteractor(mockDocketClerkUser);

      expect(caseStatusChangesByYear).toHaveBeenCalledTimes(2);
      expect(
        (caseStatusChangesByYear as jest.Mock).mock.calls[0][0].toISOString(),
      ).toEqual('2026-01-01T05:00:00.000Z');
      expect(
        (caseStatusChangesByYear as jest.Mock).mock.calls[1][0].toISOString(),
      ).toEqual('2025-10-01T04:00:00.000Z');
    });

    it('should reject with a case query error even while the petition queries are pending', async () => {
      (petitionsDataByYear as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 50)),
      );
      (caseStatusChangesByYear as jest.Mock).mockRejectedValue(
        new Error('case query failed'),
      );

      await expect(
        getClerkDashboardStatsInteractor(mockDocketClerkUser),
      ).rejects.toThrow('case query failed');
    });

    it('should use the fiscal year ending this year through September 30 Eastern time', async () => {
      // 11:59 PM on September 30 in Eastern time
      (createISODateString as jest.Mock).mockReturnValue(
        '2026-10-01T03:59:00.000Z',
      );

      const result =
        await getClerkDashboardStatsInteractor(mockDocketClerkUser);

      expect(result.year).toEqual('2026');
      expect(result.fiscalYear).toEqual('2026');
      const [fiscalBegin, fiscalEnd] = (caseStatusChangesByYear as jest.Mock)
        .mock.calls[1];
      expect(fiscalBegin.toISOString()).toEqual('2025-10-01T04:00:00.000Z');
      expect(fiscalEnd.toISOString()).toEqual('2026-10-01T04:00:00.000Z');
    });

    it('should use the fiscal year ending next year from October 1 Eastern time', async () => {
      // 12:01 AM on October 1 in Eastern time
      (createISODateString as jest.Mock).mockReturnValue(
        '2026-10-01T04:01:00.000Z',
      );

      const result =
        await getClerkDashboardStatsInteractor(mockDocketClerkUser);

      expect(result.year).toEqual('2026');
      expect(result.fiscalYear).toEqual('2027');
      const [fiscalBegin, fiscalEnd] = (caseStatusChangesByYear as jest.Mock)
        .mock.calls[1];
      expect(fiscalBegin.toISOString()).toEqual('2026-10-01T04:00:00.000Z');
      expect(fiscalEnd.toISOString()).toEqual('2027-10-01T04:00:00.000Z');
      // the petitions stats use the same fiscal year
      expect(
        (petitionsDataByYear as jest.Mock).mock.calls[1][0].toISOString(),
      ).toEqual('2026-10-01T04:00:00.000Z');
    });

    it('should return cases closed and on appeal by month and closed cases by procedure type', async () => {
      const statusChanges = [
        {
          month: '1',
          procedureType: null,
          statusGroup: 'closed',
          total: '130',
        },
        {
          month: '2',
          procedureType: null,
          statusGroup: 'closed',
          total: '113',
        },
        { month: '11', procedureType: null, statusGroup: 'closed', total: '7' },
        {
          month: '2',
          procedureType: null,
          statusGroup: 'onAppeal',
          total: '4',
        },
        {
          month: '10',
          procedureType: null,
          statusGroup: 'onAppeal',
          total: '1',
        },
        {
          month: null,
          procedureType: 'Regular',
          statusGroup: 'closed',
          total: '200',
        },
        {
          month: null,
          procedureType: 'Small',
          statusGroup: 'closed',
          total: '50',
        },
        {
          month: null,
          procedureType: 'Regular',
          statusGroup: 'onAppeal',
          total: '5',
        },
      ];
      (caseStatusChangesByYear as jest.Mock).mockResolvedValue(statusChanges);

      const result =
        await getClerkDashboardStatsInteractor(mockDocketClerkUser);

      expect(result.calendarYearCaseStats).toEqual({
        casesClosedByMonth: [130, 113, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0].map(
          (total, i) => ({ month: CALENDAR_MONTHS[i], total }),
        ),
        casesClosedByProcedureType: [
          { procedureType: 'Regular', total: 200 },
          { procedureType: 'Small', total: 50 },
        ],
        casesOnAppealByMonth: [0, 4, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0].map(
          (total, i) => ({ month: CALENDAR_MONTHS[i], total }),
        ),
      });

      expect(result.fiscalYearCaseStats.casesClosedByMonth).toEqual(
        [0, 7, 0, 130, 113, 0, 0, 0, 0, 0, 0, 0].map((total, i) => ({
          month: FISCAL_MONTHS[i],
          total,
        })),
      );
      expect(result.fiscalYearCaseStats.casesOnAppealByMonth).toEqual(
        [1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0].map((total, i) => ({
          month: FISCAL_MONTHS[i],
          total,
        })),
      );
    });

    it('should return zeroed case stats when there are no status changes', async () => {
      const result =
        await getClerkDashboardStatsInteractor(mockDocketClerkUser);

      expect(result.calendarYearCaseStats).toEqual({
        casesClosedByMonth: CALENDAR_MONTHS.map(month => ({ month, total: 0 })),
        casesClosedByProcedureType: [
          { procedureType: 'Regular', total: 0 },
          { procedureType: 'Small', total: 0 },
        ],
        casesOnAppealByMonth: CALENDAR_MONTHS.map(month => ({
          month,
          total: 0,
        })),
      });
    });
  });
});
