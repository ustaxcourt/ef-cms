import { withAppContextDecorator } from '@web-client/withAppContext';
import { dashboardClerkOfTheCourtHelper as dashboardClerkOfTheCourtHelperComputed } from './dashboardClerkOfTheCourtHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';

const dashboardClerkOfTheCourtHelper = withAppContextDecorator(
  dashboardClerkOfTheCourtHelperComputed,
  { ...applicationContext },
);

describe('dashboardClerkOfTheCourtHelper', () => {
  let baseState;
  beforeEach(() => {
    baseState = {
      clerkOfCourtDashboardOptions: {
        petitionsByYearIsFiscal: false,
      },
      clerkOfCourtDashboardStats: {
        calendarYearPetitionStats: {
          petitionFullPaperMonths: Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            isPaper: true,
            total: i * 100,
          })),
          petitionFullElectronicMonths: Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            isPaper: false,
            total: i * 100 + 50,
          })),
          petitionsByServiceType: [
            {
              total: 7200,
              isPaper: false,
            },
            {
              total: 6600,
              isPaper: true,
            },
          ],
          petitionsByRepresentation: [
            {
              total: 6800,
              isRepresenting: false,
            },
            {
              total: 7000,
              isRepresenting: true,
            },
          ],
        },
        fiscalYearPetitionStats: {
          petitionFullPaperMonths: Array.from({ length: 12 }, (_, i) => ({
            month: i < 3 ? i + 10 : i - 2,
            isPaper: true,
            total: i < 3 ? i * 100 + 1500 : (i - 2) * 100,
          })),
          petitionFullElectronicMonths: Array.from({ length: 12 }, (_, i) => ({
            month: i < 3 ? i + 10 : i - 2,
            isPaper: false,
            total: i < 3 ? i * 100 + 1550 : (i - 2) * 100 + 50,
          })),
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
        year: '2026',
      },
    };
  });

  it('should set computed results for calendar year to date', () => {
    const result = runCompute(dashboardClerkOfTheCourtHelper, {
      state: baseState,
    });

    expect(result).toStrictEqual({
      petitionsByMonthAndServiceTypeChartData: [
        {
          color: '#005EA2',
          data: [50, 150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150],
          label: 'Electronic',
        },
        {
          color: '#FFBE2E',
          data: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
          label: 'Paper',
        },
      ],
      petitionsByRepresentationPieData: [
        {
          color: '#005EA2',
          name: 'Pro Se',
          value: 6800,
        },
        {
          color: '#FFBE2E',
          name: 'Represented',
          value: 7000,
        },
      ],
      petitionsByServiceTypePieData: [
        {
          color: '#005EA2',
          name: 'Electronic',
          value: 7200,
        },
        {
          color: '#FFBE2E',
          name: 'Paper',
          value: 6600,
        },
      ],
      totalPetitions: '13,800',
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      year: '2026',
    });
  });

  it('should set computed results for fiscal year to date', () => {
    baseState.clerkOfCourtDashboardOptions.petitionsByYearIsFiscal = true;
    const result = runCompute(dashboardClerkOfTheCourtHelper, {
      state: baseState,
    });

    expect(result).toStrictEqual({
      petitionsByMonthAndServiceTypeChartData: [
        {
          color: '#005EA2',
          data: [1550, 1650, 1750, 150, 250, 350, 450, 550, 650, 750, 850, 950],
          label: 'Electronic',
        },
        {
          color: '#FFBE2E',
          data: [1500, 1600, 1700, 100, 200, 300, 400, 500, 600, 700, 800, 900],
          label: 'Paper',
        },
      ],
      petitionsByRepresentationPieData: [
        {
          color: '#005EA2',
          name: 'Pro Se',
          value: 11200,
        },
        {
          color: '#FFBE2E',
          name: 'Represented',
          value: 8000,
        },
      ],
      petitionsByServiceTypePieData: [
        {
          color: '#005EA2',
          name: 'Electronic',
          value: 9900,
        },
        {
          color: '#FFBE2E',
          name: 'Paper',
          value: 9300,
        },
      ],
      totalPetitions: '19,200',
      months: [
        'October',
        'November',
        'December',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
      ],
      year: '2026',
    });
  });

  it('should handle empty data', () => {
    baseState.clerkOfCourtDashboardStats.calendarYearPetitionStats = {
      petitionFullPaperMonths: [],
      petitionFullElectronicMonths: [],
      petitionsByServiceType: [],
      petitionsByRepresentation: [],
    };
    const result = runCompute(dashboardClerkOfTheCourtHelper, {
      state: baseState,
    });

    expect(result).toStrictEqual({
      petitionsByMonthAndServiceTypeChartData: [
        {
          color: '#005EA2',
          data: [],
          label: 'Electronic',
        },
        {
          color: '#FFBE2E',
          data: [],
          label: 'Paper',
        },
      ],
      petitionsByRepresentationPieData: [],
      petitionsByServiceTypePieData: [],
      totalPetitions: '0',
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      year: '2026',
    });
  });
});
