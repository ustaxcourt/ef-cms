/* eslint-disable max-lines */
import { getClerkDashboardStatsInteractor } from './getClerkDashboardStatsInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats',
  () => ({
    petitionsDataByYear: jest.fn(),
  }),
);

jest.mock('@shared/business/utilities/DateHandler', () => ({
  ...jest.requireActual('@shared/business/utilities/DateHandler'),
  createISODateString: jest.fn(),
}));

import { petitionsDataByYear } from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
import { createISODateString } from '@shared/business/utilities/DateHandler';

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

    expect(result).toEqual({
      year: '2026',
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
});
