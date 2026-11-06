import { getClerkDashboardCasesStatsInteractor } from './getClerkDashboardCasesStatsInteractor';
import { Month } from './clerkDashboardStats';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

jest.mock(
  '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats',
  () => ({
    caseStatusChangesByYear: jest.fn(),
    openCasesByProcedureTypeAndCaseType: jest.fn(),
  }),
);

jest.mock('@shared/business/utilities/DateHandler', () => ({
  ...jest.requireActual('@shared/business/utilities/DateHandler'),
  createISODateString: jest.fn(),
}));

import {
  caseStatusChangesByYear,
  openCasesByProcedureTypeAndCaseType,
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

describe('getClerkDashboardCasesStatsInteractor', () => {
  beforeEach(() => {
    (openCasesByProcedureTypeAndCaseType as jest.Mock).mockResolvedValue([]);
    (caseStatusChangesByYear as jest.Mock).mockResolvedValue([]);
    (createISODateString as jest.Mock).mockReturnValue(
      '2026-02-01T00:00:00.000Z',
    );
  });

  it('should throw an unauthorized error when the user does not have access', async () => {
    await expect(
      getClerkDashboardCasesStatsInteractor(mockPetitionerUser),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return open cases by procedure type in Regular, Small order', async () => {
    (openCasesByProcedureTypeAndCaseType as jest.Mock).mockResolvedValue([
      { caseType: null, procedureType: 'Small', total: '5591' },
      { caseType: null, procedureType: 'Regular', total: '14216' },
      { caseType: 'Deficiency', procedureType: null, total: '19807' },
    ]);

    const result =
      await getClerkDashboardCasesStatsInteractor(mockDocketClerkUser);

    expect(result.openCasesByProcedureType).toEqual([
      { procedureType: 'Regular', total: 14216 },
      { procedureType: 'Small', total: 5591 },
    ]);
  });

  it('should default missing procedure types to zero', async () => {
    (openCasesByProcedureTypeAndCaseType as jest.Mock).mockResolvedValue([
      { caseType: null, procedureType: 'Regular', total: '12' },
    ]);

    const result =
      await getClerkDashboardCasesStatsInteractor(mockDocketClerkUser);

    expect(result.openCasesByProcedureType).toEqual([
      { procedureType: 'Regular', total: 12 },
      { procedureType: 'Small', total: 0 },
    ]);
  });

  it('should return open cases for every case type, defaulting missing case types to zero', async () => {
    (openCasesByProcedureTypeAndCaseType as jest.Mock).mockResolvedValue([
      { caseType: 'Deficiency', procedureType: null, total: '1798' },
      {
        caseType: 'Partnership (Section 6226)',
        procedureType: null,
        total: '48',
      },
      { caseType: null, procedureType: 'Regular', total: '1846' },
    ]);

    const result =
      await getClerkDashboardCasesStatsInteractor(mockDocketClerkUser);

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
      await getClerkDashboardCasesStatsInteractor(mockDocketClerkUser);

    expect(result.openCasesByCaseType.map(c => c.caseType)).toEqual(CASE_TYPES);
  });

  it('should query case status changes once for both the calendar and fiscal year', async () => {
    await getClerkDashboardCasesStatsInteractor(mockDocketClerkUser);

    expect(caseStatusChangesByYear).toHaveBeenCalledTimes(1);
    const [{ calendarYear, fiscalYear }] = (
      caseStatusChangesByYear as jest.Mock
    ).mock.calls[0];
    expect(calendarYear.begin.toISOString()).toEqual(
      '2026-01-01T05:00:00.000Z',
    );
    expect(calendarYear.end.toISOString()).toEqual('2027-01-01T05:00:00.000Z');
    expect(fiscalYear.begin.toISOString()).toEqual('2025-10-01T04:00:00.000Z');
    expect(fiscalYear.end.toISOString()).toEqual('2026-10-01T04:00:00.000Z');
  });

  it('should reject with a status change query error even while the open cases query is pending', async () => {
    // the open cases query never settles
    (openCasesByProcedureTypeAndCaseType as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );
    (caseStatusChangesByYear as jest.Mock).mockRejectedValue(
      new Error('case query failed'),
    );

    await expect(
      getClerkDashboardCasesStatsInteractor(mockDocketClerkUser),
    ).rejects.toThrow('case query failed');
  });

  it('should use the fiscal year ending this year through September 30 Eastern time', async () => {
    // 11:59 PM on September 30 in Eastern time
    (createISODateString as jest.Mock).mockReturnValue(
      '2026-10-01T03:59:00.000Z',
    );

    const result =
      await getClerkDashboardCasesStatsInteractor(mockDocketClerkUser);

    expect(result.year).toEqual('2026');
    expect(result.fiscalYear).toEqual('2026');
    const [{ fiscalYear }] = (caseStatusChangesByYear as jest.Mock).mock
      .calls[0];
    expect(fiscalYear.begin.toISOString()).toEqual('2025-10-01T04:00:00.000Z');
    expect(fiscalYear.end.toISOString()).toEqual('2026-10-01T04:00:00.000Z');
  });

  it('should use the fiscal year ending next year from October 1 Eastern time', async () => {
    // 12:01 AM on October 1 in Eastern time
    (createISODateString as jest.Mock).mockReturnValue(
      '2026-10-01T04:01:00.000Z',
    );

    const result =
      await getClerkDashboardCasesStatsInteractor(mockDocketClerkUser);

    expect(result.year).toEqual('2026');
    expect(result.fiscalYear).toEqual('2027');
    const [{ fiscalYear }] = (caseStatusChangesByYear as jest.Mock).mock
      .calls[0];
    expect(fiscalYear.begin.toISOString()).toEqual('2026-10-01T04:00:00.000Z');
    expect(fiscalYear.end.toISOString()).toEqual('2027-10-01T04:00:00.000Z');
  });

  it('should return cases closed and on appeal by month and closed cases by procedure type', async () => {
    const statusChanges = [
      {
        month: '1',
        procedureType: null,
        statusGroup: 'closed',
        calendarYearTotal: '130',
        fiscalYearTotal: '130',
      },
      {
        month: '2',
        procedureType: null,
        statusGroup: 'closed',
        calendarYearTotal: '113',
        fiscalYearTotal: '113',
      },
      {
        month: '11',
        procedureType: null,
        statusGroup: 'closed',
        calendarYearTotal: '7',
        fiscalYearTotal: '7',
      },
      {
        month: '2',
        procedureType: null,
        statusGroup: 'onAppeal',
        calendarYearTotal: '4',
        fiscalYearTotal: '4',
      },
      {
        month: '10',
        procedureType: null,
        statusGroup: 'onAppeal',
        calendarYearTotal: '1',
        fiscalYearTotal: '1',
      },
      {
        month: null,
        procedureType: 'Regular',
        statusGroup: 'closed',
        calendarYearTotal: '200',
        fiscalYearTotal: '200',
      },
      {
        month: null,
        procedureType: 'Small',
        statusGroup: 'closed',
        calendarYearTotal: '50',
        fiscalYearTotal: '50',
      },
      {
        month: null,
        procedureType: 'Regular',
        statusGroup: 'onAppeal',
        calendarYearTotal: '5',
        fiscalYearTotal: '5',
      },
    ];
    (caseStatusChangesByYear as jest.Mock).mockResolvedValue(statusChanges);

    const result =
      await getClerkDashboardCasesStatsInteractor(mockDocketClerkUser);

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

  it('should take the calendar and fiscal year totals from their own columns', async () => {
    (caseStatusChangesByYear as jest.Mock).mockResolvedValue([
      {
        calendarYearTotal: '0',
        fiscalYearTotal: '9',
        month: '12',
        procedureType: null,
        statusGroup: 'closed',
      },
      {
        calendarYearTotal: '3',
        fiscalYearTotal: '0',
        month: '1',
        procedureType: null,
        statusGroup: 'onAppeal',
      },
      {
        calendarYearTotal: '6',
        fiscalYearTotal: '2',
        month: null,
        procedureType: 'Small',
        statusGroup: 'closed',
      },
    ]);

    const result =
      await getClerkDashboardCasesStatsInteractor(mockDocketClerkUser);

    expect(
      result.calendarYearCaseStats.casesClosedByMonth.find(
        ({ month }) => month === Month.December,
      )?.total,
    ).toEqual(0);
    expect(
      result.fiscalYearCaseStats.casesClosedByMonth.find(
        ({ month }) => month === Month.December,
      )?.total,
    ).toEqual(9);
    expect(
      result.calendarYearCaseStats.casesOnAppealByMonth.find(
        ({ month }) => month === Month.January,
      )?.total,
    ).toEqual(3);
    expect(
      result.fiscalYearCaseStats.casesOnAppealByMonth.find(
        ({ month }) => month === Month.January,
      )?.total,
    ).toEqual(0);
    expect(result.calendarYearCaseStats.casesClosedByProcedureType).toEqual([
      { procedureType: 'Regular', total: 0 },
      { procedureType: 'Small', total: 6 },
    ]);
    expect(result.fiscalYearCaseStats.casesClosedByProcedureType).toEqual([
      { procedureType: 'Regular', total: 0 },
      { procedureType: 'Small', total: 2 },
    ]);
  });

  it('should return zeroed case stats when there are no status changes', async () => {
    const result =
      await getClerkDashboardCasesStatsInteractor(mockDocketClerkUser);

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
