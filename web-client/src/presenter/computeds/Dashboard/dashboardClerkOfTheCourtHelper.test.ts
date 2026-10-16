import { withAppContextDecorator } from '@web-client/withAppContext';
import { dashboardClerkOfTheCourtHelper as dashboardClerkOfTheCourtHelperComputed } from './dashboardClerkOfTheCourtHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';

const dashboardClerkOfTheCourtHelper = withAppContextDecorator(
  dashboardClerkOfTheCourtHelperComputed,
  { ...applicationContext },
);

describe('dashboardClerkOfTheCourtHelper', () => {
  let baseState;
  beforeEach(() => {
    baseState = {
      clerkOfCourtDashboardOptions: {
        casesByYearIsFiscal: false,
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
        openCasesByCaseType: [
          { caseType: 'Deficiency', total: 1798 },
          { caseType: 'Declaratory Judgment (Exempt Organization)', total: 51 },
          { caseType: 'Declaratory Judgment (Retirement Plan)', total: 75 },
          { caseType: 'Partnership (BBA Section 1101)', total: 26 },
          { caseType: 'Partnership (Section 6226)', total: 48 },
          { caseType: 'Partnership (Section 6228)', total: 75 },
          { caseType: 'Passport', total: 0 },
        ],
        openCasesByProcedureType: [
          { procedureType: 'Regular', total: 14216 },
          { procedureType: 'Small', total: 5591 },
        ],
        calendarYearCaseStats: {
          casesClosedByMonth: Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            total: i < 4 ? 100 + i : 0,
          })),
          casesClosedByProcedureType: [
            { procedureType: 'Regular', total: 300 },
            { procedureType: 'Small', total: 106 },
          ],
          casesOnAppealByMonth: Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            total: i === 1 ? 4 : i === 3 ? 2 : 0,
          })),
        },
        fiscalYearCaseStats: {
          casesClosedByMonth: Array.from({ length: 12 }, (_, i) => ({
            month: i < 3 ? i + 10 : i - 2,
            total: i < 7 ? 200 + i : 0,
          })),
          casesClosedByProcedureType: [
            { procedureType: 'Regular', total: 1000 },
            { procedureType: 'Small', total: 421 },
          ],
          casesOnAppealByMonth: Array.from({ length: 12 }, (_, i) => ({
            month: i < 3 ? i + 10 : i - 2,
            total: i < 7 ? 3 : 0,
          })),
        },
        fiscalYear: '2027',
        year: '2026',
      },
    };
  });

  it('should set computed results for calendar year to date', () => {
    const result = runCompute(dashboardClerkOfTheCourtHelper, {
      state: baseState,
    });

    expect(result).toMatchObject({
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
      petitionsYearLabel: 'YTD 2026',
    });
  });

  it('should set computed results for fiscal year to date', () => {
    baseState.clerkOfCourtDashboardOptions.petitionsByYearIsFiscal = true;
    const result = runCompute(dashboardClerkOfTheCourtHelper, {
      state: baseState,
    });

    expect(result).toMatchObject({
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
      petitionsYearLabel: 'FYTD 2027',
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

    expect(result).toMatchObject({
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
      petitionsYearLabel: 'YTD 2026',
    });
  });
  describe('cases', () => {
    it('should set open cases pie data and total regardless of the year option', () => {
      baseState.clerkOfCourtDashboardOptions.casesByYearIsFiscal = true;

      const result = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });

      expect(result.openCasesPieData).toEqual([
        { color: '#005EA2', name: 'Regular', value: 14216 },
        { color: '#FFBE2E', name: 'Small', value: 5591 },
      ]);
      expect(result.totalOpenCases).toEqual('19,807');
    });

    it('should set computed cases results for calendar year to date', () => {
      const result = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });

      expect(result).toMatchObject({
        casesClosedAndOnAppealByMonthChartData: [
          {
            color: '#005EA2',
            data: [100, 101, 102, 103, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Closed/Closed-Dismissed',
          },
          {
            color: '#FFBE2E',
            data: [0, 4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Changed to On Appeal',
          },
        ],
        casesClosedAndOnAppealLegendTotals: [406, 6],
        casesClosedPieData: [
          { color: '#005EA2', name: 'Regular', value: 300 },
          { color: '#FFBE2E', name: 'Small', value: 106 },
        ],
        casesMonths: [
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
        totalCasesClosed: '406',
      });
    });

    it('should set computed cases results for fiscal year to date', () => {
      baseState.clerkOfCourtDashboardOptions.casesByYearIsFiscal = true;

      const result = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });

      expect(result).toMatchObject({
        casesClosedAndOnAppealByMonthChartData: [
          {
            color: '#005EA2',
            data: [200, 201, 202, 203, 204, 205, 206, 0, 0, 0, 0, 0],
            label: 'Closed/Closed-Dismissed',
          },
          {
            color: '#FFBE2E',
            data: [3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0],
            label: 'Changed to On Appeal',
          },
        ],
        casesClosedAndOnAppealLegendTotals: [1421, 21],
        casesClosedPieData: [
          { color: '#005EA2', name: 'Regular', value: 1000 },
          { color: '#FFBE2E', name: 'Small', value: 421 },
        ],
        casesMonths: [
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
        totalCasesClosed: '1,421',
      });
    });

    it('should not change petitions data when only the cases year option is fiscal', () => {
      baseState.clerkOfCourtDashboardOptions.casesByYearIsFiscal = true;

      const result = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });

      expect(result.totalPetitions).toEqual('13,800');
      expect(result.months[0]).toEqual('January');
    });

    it('should set open cases by type table rows for every case type, largest total first', () => {
      const result = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });

      // equal totals keep the Deficiency-first case type order
      expect(result.openCasesByTypeTableRows).toEqual([
        { label: 'Deficiency', total: '1,798' },
        { label: 'Declaratory Judgment (Retirement Plan)', total: '75' },
        { label: 'Partnership (Section 6228)', total: '75' },
        { label: 'Declaratory Judgment (Exempt Organization)', total: '51' },
        { label: 'Partnership (Section 6226)', total: '48' },
        { label: 'Partnership (BBA Section 1101)', total: '26' },
        { label: 'CDP (Lien/Levy)', total: '0' },
        { label: 'Disclosure', total: '0' },
        { label: 'Innocent Spouse', total: '0' },
        { label: 'Interest Abatement', total: '0' },
        { label: 'Other', total: '0' },
        { label: 'Passport', total: '0' },
        { label: 'Whistleblower', total: '0' },
        { label: 'Worker Classification', total: '0' },
      ]);
    });

    it('should sort open cases by type by the numeric total, not the formatted text', () => {
      baseState.clerkOfCourtDashboardStats.openCasesByCaseType = [
        { caseType: 'Other', total: 9 },
        { caseType: 'Passport', total: 1000 },
        { caseType: 'Disclosure', total: 100 },
      ];

      const result = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });

      expect(
        result.openCasesByTypeTableRows.slice(0, 3).map(row => row.label),
      ).toEqual(['Passport', 'Disclosure', 'Other']);
    });

    it('should label the cases year by the cases year option', () => {
      expect(
        runCompute(dashboardClerkOfTheCourtHelper, { state: baseState })
          .casesYearLabel,
      ).toEqual('YTD 2026');

      baseState.clerkOfCourtDashboardOptions.casesByYearIsFiscal = true;

      const result = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });
      expect(result.casesYearLabel).toEqual('FYTD 2027');
      // the petitions label follows its own option
      expect(result.petitionsYearLabel).toEqual('YTD 2026');
    });

    it('should not change open cases by type with the cases year option', () => {
      const calendarResult = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });
      baseState.clerkOfCourtDashboardOptions.casesByYearIsFiscal = true;
      const fiscalResult = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });

      expect(fiscalResult.openCasesByTypeTableRows).toEqual(
        calendarResult.openCasesByTypeTableRows,
      );
    });

    it('should zero open cases by type when there are no open cases', () => {
      baseState.clerkOfCourtDashboardStats.openCasesByCaseType = [];

      const result = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });

      expect(result.openCasesByTypeTableRows).toHaveLength(14);
      result.openCasesByTypeTableRows.forEach(row => {
        expect(row.total).toEqual('0');
      });
    });

    it('should fall back to the current year before the stats have loaded', () => {
      baseState.clerkOfCourtDashboardStats.year = '';
      baseState.clerkOfCourtDashboardStats.fiscalYear = '';
      baseState.clerkOfCourtDashboardOptions.petitionsByYearIsFiscal = true;

      const result = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });

      expect(result.casesYearLabel).toEqual(`YTD ${formatNow(FORMATS.YEAR)}`);
      expect(result.petitionsYearLabel).toEqual(
        `FYTD ${formatNow(FORMATS.YEAR)}`,
      );
    });

    it('should return empty pie data when there are no cases', () => {
      baseState.clerkOfCourtDashboardStats.openCasesByProcedureType = [
        { procedureType: 'Regular', total: 0 },
        { procedureType: 'Small', total: 0 },
      ];
      baseState.clerkOfCourtDashboardStats.calendarYearCaseStats = {
        casesClosedByMonth: [],
        casesClosedByProcedureType: [],
        casesOnAppealByMonth: [],
      };

      const result = runCompute(dashboardClerkOfTheCourtHelper, {
        state: baseState,
      });

      expect(result).toMatchObject({
        casesClosedAndOnAppealLegendTotals: [0, 0],
        casesClosedPieData: [],
        openCasesPieData: [],
        totalCasesClosed: '0',
        totalOpenCases: '0',
      });
    });
  });
});
