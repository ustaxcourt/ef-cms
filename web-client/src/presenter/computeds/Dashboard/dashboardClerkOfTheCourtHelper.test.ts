import { withAppContextDecorator } from '@web-client/withAppContext';
import { dashboardClerkOfTheCourtHelper as dashboardClerkOfTheCourtHelperComputed } from './dashboardClerkOfTheCourtHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import {
  FISCAL_MONTH_LABELS,
  GRAPH_COLORS,
  MONTH_LABELS,
} from '@shared/business/entities/EntityConstants';
import { Month } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import { sum } from 'lodash';

const dashboardClerkOfTheCourtHelper = withAppContextDecorator(
  dashboardClerkOfTheCourtHelperComputed,
  { ...applicationContext },
);

const toMonths = (labels: string[]): Month[] =>
  labels.map(label => Month[label as keyof typeof Month]);
const CALENDAR_MONTHS = toMonths(MONTH_LABELS);
const FISCAL_MONTHS = toMonths(FISCAL_MONTH_LABELS);

// totals are in chart order: January first for YTD, October first for FYTD
const toMonthTotals = (months: Month[], totals: number[]) =>
  months.map((month, i) => ({ month, total: totals[i] }));

const CALENDAR_PETITIONS_ELECTRONIC_BY_MONTH = [
  50, 150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150,
];
const CALENDAR_PETITIONS_PAPER_BY_MONTH = [
  0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100,
];
const FISCAL_PETITIONS_ELECTRONIC_BY_MONTH = [
  1550, 1650, 1750, 150, 250, 350, 450, 550, 650, 750, 850, 950,
];
const FISCAL_PETITIONS_PAPER_BY_MONTH = [
  1500, 1600, 1700, 100, 200, 300, 400, 500, 600, 700, 800, 900,
];

const OPEN_CASES = { regular: 14216, small: 5591 };
const CALENDAR_CLOSED_CASES = { regular: 300, small: 106 };
const FISCAL_CLOSED_CASES = { regular: 1000, small: 421 };
const CALENDAR_CLOSED_BY_MONTH = [100, 101, 102, 103, 0, 0, 0, 0, 0, 0, 0, 0];
const CALENDAR_ON_APPEAL_BY_MONTH = [0, 4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0];
const FISCAL_CLOSED_BY_MONTH = [
  200, 201, 202, 203, 204, 205, 206, 0, 0, 0, 0, 0,
];
const FISCAL_ON_APPEAL_BY_MONTH = [3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0];

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
          petitionFullPaperMonths: toMonthTotals(
            CALENDAR_MONTHS,
            CALENDAR_PETITIONS_PAPER_BY_MONTH,
          ).map(monthTotal => ({ ...monthTotal, isPaper: true })),
          petitionFullElectronicMonths: toMonthTotals(
            CALENDAR_MONTHS,
            CALENDAR_PETITIONS_ELECTRONIC_BY_MONTH,
          ).map(monthTotal => ({ ...monthTotal, isPaper: false })),
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
          petitionFullPaperMonths: toMonthTotals(
            FISCAL_MONTHS,
            FISCAL_PETITIONS_PAPER_BY_MONTH,
          ).map(monthTotal => ({ ...monthTotal, isPaper: true })),
          petitionFullElectronicMonths: toMonthTotals(
            FISCAL_MONTHS,
            FISCAL_PETITIONS_ELECTRONIC_BY_MONTH,
          ).map(monthTotal => ({ ...monthTotal, isPaper: false })),
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
          { procedureType: 'Regular', total: OPEN_CASES.regular },
          { procedureType: 'Small', total: OPEN_CASES.small },
        ],
        calendarYearCaseStats: {
          casesClosedByMonth: toMonthTotals(
            CALENDAR_MONTHS,
            CALENDAR_CLOSED_BY_MONTH,
          ),
          casesClosedByProcedureType: [
            { procedureType: 'Regular', total: CALENDAR_CLOSED_CASES.regular },
            { procedureType: 'Small', total: CALENDAR_CLOSED_CASES.small },
          ],
          casesOnAppealByMonth: toMonthTotals(
            CALENDAR_MONTHS,
            CALENDAR_ON_APPEAL_BY_MONTH,
          ),
        },
        fiscalYearCaseStats: {
          casesClosedByMonth: toMonthTotals(
            FISCAL_MONTHS,
            FISCAL_CLOSED_BY_MONTH,
          ),
          casesClosedByProcedureType: [
            { procedureType: 'Regular', total: FISCAL_CLOSED_CASES.regular },
            { procedureType: 'Small', total: FISCAL_CLOSED_CASES.small },
          ],
          casesOnAppealByMonth: toMonthTotals(
            FISCAL_MONTHS,
            FISCAL_ON_APPEAL_BY_MONTH,
          ),
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
          color: GRAPH_COLORS.BLUE,
          data: CALENDAR_PETITIONS_ELECTRONIC_BY_MONTH,
          label: 'Electronic',
        },
        {
          color: GRAPH_COLORS.YELLOW,
          data: CALENDAR_PETITIONS_PAPER_BY_MONTH,
          label: 'Paper',
        },
      ],
      petitionsByRepresentationPieData: [
        {
          color: GRAPH_COLORS.BLUE,
          name: 'Pro Se',
          value: 6800,
        },
        {
          color: GRAPH_COLORS.YELLOW,
          name: 'Represented',
          value: 7000,
        },
      ],
      petitionsByServiceTypePieData: [
        {
          color: GRAPH_COLORS.BLUE,
          name: 'Electronic',
          value: 7200,
        },
        {
          color: GRAPH_COLORS.YELLOW,
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
          color: GRAPH_COLORS.BLUE,
          data: FISCAL_PETITIONS_ELECTRONIC_BY_MONTH,
          label: 'Electronic',
        },
        {
          color: GRAPH_COLORS.YELLOW,
          data: FISCAL_PETITIONS_PAPER_BY_MONTH,
          label: 'Paper',
        },
      ],
      petitionsByRepresentationPieData: [
        {
          color: GRAPH_COLORS.BLUE,
          name: 'Pro Se',
          value: 11200,
        },
        {
          color: GRAPH_COLORS.YELLOW,
          name: 'Represented',
          value: 8000,
        },
      ],
      petitionsByServiceTypePieData: [
        {
          color: GRAPH_COLORS.BLUE,
          name: 'Electronic',
          value: 9900,
        },
        {
          color: GRAPH_COLORS.YELLOW,
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
          color: GRAPH_COLORS.BLUE,
          data: [],
          label: 'Electronic',
        },
        {
          color: GRAPH_COLORS.YELLOW,
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
        {
          color: GRAPH_COLORS.BLUE,
          name: 'Regular',
          value: OPEN_CASES.regular,
        },
        { color: GRAPH_COLORS.YELLOW, name: 'Small', value: OPEN_CASES.small },
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
            color: GRAPH_COLORS.BLUE,
            data: CALENDAR_CLOSED_BY_MONTH,
            label: 'Closed/Closed-Dismissed',
          },
          {
            color: GRAPH_COLORS.YELLOW,
            data: CALENDAR_ON_APPEAL_BY_MONTH,
            label: 'Changed to On Appeal',
          },
        ],
        casesClosedAndOnAppealLegendTotals: [
          CALENDAR_CLOSED_CASES.regular + CALENDAR_CLOSED_CASES.small,
          sum(CALENDAR_ON_APPEAL_BY_MONTH),
        ],
        casesClosedPieData: [
          {
            color: GRAPH_COLORS.BLUE,
            name: 'Regular',
            value: CALENDAR_CLOSED_CASES.regular,
          },
          {
            color: GRAPH_COLORS.YELLOW,
            name: 'Small',
            value: CALENDAR_CLOSED_CASES.small,
          },
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
            color: GRAPH_COLORS.BLUE,
            data: FISCAL_CLOSED_BY_MONTH,
            label: 'Closed/Closed-Dismissed',
          },
          {
            color: GRAPH_COLORS.YELLOW,
            data: FISCAL_ON_APPEAL_BY_MONTH,
            label: 'Changed to On Appeal',
          },
        ],
        casesClosedAndOnAppealLegendTotals: [
          FISCAL_CLOSED_CASES.regular + FISCAL_CLOSED_CASES.small,
          sum(FISCAL_ON_APPEAL_BY_MONTH),
        ],
        casesClosedPieData: [
          {
            color: GRAPH_COLORS.BLUE,
            name: 'Regular',
            value: FISCAL_CLOSED_CASES.regular,
          },
          {
            color: GRAPH_COLORS.YELLOW,
            name: 'Small',
            value: FISCAL_CLOSED_CASES.small,
          },
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
