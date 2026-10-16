import {
  CASE_STATUS_TYPES,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import {
  FORMATS,
  calculateISODate,
  prepareDateFromEST,
  prepareDateFromString,
} from '@shared/business/utilities/DateHandler';
import { loginAsClerkOfCourt } from 'cypress/helpers/authentication/login-as-helpers';

type StatusGroup = 'closed' | 'onAppeal';

type CountedChange = {
  date: string;
  month: number;
  procedureType: string;
  statusGroup: StatusGroup;
};

type StatsWindow = { begin: string; end: string };

type MonthTotal = { month: number; total: number };

type CaseStats = {
  casesClosedByMonth: MonthTotal[];
  casesClosedByProcedureType: { procedureType: string; total: number }[];
  casesOnAppealByMonth: MonthTotal[];
};

const { closed, closedDismissed, generalDocket, onAppeal } = CASE_STATUS_TYPES;
const { regular, small } = PROCEDURE_TYPES_MAP;

const docketNumbers = ['9101-97', '9102-97', '9103-97', '9104-97', '9105-97'];

// received long before any dashboard timeframe, matching the task's receivedAt
const RECEIVED_AT = '1997-06-16T16:00:00.000Z';

const toMillis = (isoDate: string) =>
  prepareDateFromString(isoDate, FORMATS.ISO).toMillis();

// midnight Eastern on the given date, as a UTC ISO string
const startOfDayEastern = (date: string) =>
  prepareDateFromEST(date, FORMATS.YYYYMMDD)!;

const totalFor = <T extends { total: number }>(
  entries: T[],
  match: (entry: T) => boolean,
) => entries.find(match)?.total ?? 0;

// how much each count should grow, from the counted changes that fall in the window
const getExpectedIncrease = (
  countedChanges: CountedChange[],
  { begin, end }: StatsWindow,
) => {
  const inWindow = countedChanges.filter(
    ({ date }) =>
      toMillis(date) >= toMillis(begin) && toMillis(date) < toMillis(end),
  );
  const count = (match: (change: CountedChange) => boolean) =>
    inWindow.filter(match).length;

  return {
    closedByMonth: (month: number) =>
      count(c => c.statusGroup === 'closed' && c.month === month),
    closedByProcedureType: (procedureType: string) =>
      count(
        c => c.statusGroup === 'closed' && c.procedureType === procedureType,
      ),
    onAppealByMonth: (month: number) =>
      count(c => c.statusGroup === 'onAppeal' && c.month === month),
  };
};

const expectIncrease = (
  label: string,
  before: CaseStats,
  after: CaseStats,
  expected: ReturnType<typeof getExpectedIncrease>,
) => {
  [regular, small].forEach(procedureType => {
    const match = (entry: { procedureType: string }) =>
      entry.procedureType === procedureType;
    expect(
      totalFor(after.casesClosedByProcedureType, match) -
        totalFor(before.casesClosedByProcedureType, match),
      `${label}: closed ${procedureType}`,
    ).to.equal(expected.closedByProcedureType(procedureType));
  });

  for (let month = 1; month <= 12; month++) {
    const match = (entry: MonthTotal) => entry.month === month;
    expect(
      totalFor(after.casesClosedByMonth, match) -
        totalFor(before.casesClosedByMonth, match),
      `${label}: closed in month ${month}`,
    ).to.equal(expected.closedByMonth(month));
    expect(
      totalFor(after.casesOnAppealByMonth, match) -
        totalFor(before.casesOnAppealByMonth, match),
      `${label}: changed to On Appeal in month ${month}`,
    ).to.equal(expected.onAppealByMonth(month));
  }
};

describe('Clerk of Court Dashboard - case status change counts', () => {
  const deleteStatusHistoryCases = () =>
    cy.task('deleteCasesByDocketNumbers', { docketNumbers });

  before(deleteStatusHistoryCases);
  after(deleteStatusHistoryCases);

  it('should count each change to Closed or On Appeal in the timeframe it happened, including after a reopen and at the fiscal-year boundary', () => {
    cy.intercept('GET', '**/clerk-dashboard-stats').as('clerkDashboardStats');
    loginAsClerkOfCourt();

    cy.wait('@clerkDashboardStats').then(({ response: beforeResponse }) => {
      const before = beforeResponse!.body;
      const year = Number(before.year);
      const fiscalYear = Number(before.fiscalYear);

      const calendarYearWindow: StatsWindow = {
        begin: startOfDayEastern(`${year}-01-01`),
        end: startOfDayEastern(`${year + 1}-01-01`),
      };
      const fiscalYearWindow: StatsWindow = {
        begin: startOfDayEastern(`${fiscalYear - 1}-10-01`),
        end: startOfDayEastern(`${fiscalYear}-10-01`),
      };

      // a time relative to the start of the fiscal year (October 1, midnight Eastern)
      const fromFiscalStart = (
        howMuch: number,
        units: 'days' | 'minutes',
      ): string =>
        calculateISODate({
          dateString: fiscalYearWindow.begin,
          howMuch,
          units,
        });

      const oneDayIn = fromFiscalStart(1, 'days');
      const threeDaysIn = fromFiscalStart(3, 'days');
      const fourDaysIn = fromFiscalStart(4, 'days');
      const fiveDaysIn = fromFiscalStart(5, 'days');
      const oneMinuteBefore = fromFiscalStart(-1, 'minutes');
      const oneMinuteIn = fromFiscalStart(1, 'minutes');
      const longBefore = fromFiscalStart(-400, 'days');

      const statusHistory = (changes: [string, string][]) => [
        { date: RECEIVED_AT, updatedCaseStatus: CASE_STATUS_TYPES.new },
        ...changes.map(([date, updatedCaseStatus]) => ({
          date,
          updatedCaseStatus,
        })),
      ];

      const cases = [
        {
          // closed, reopened, closed again: both closures count
          docketNumber: docketNumbers[0],
          procedureType: regular,
          statusChanges: statusHistory([
            [oneDayIn, closed],
            [fromFiscalStart(2, 'days'), generalDocket],
            [threeDaysIn, closed],
          ]),
        },
        {
          // closed one minute before the fiscal year starts (September 30, Eastern)
          docketNumber: docketNumbers[1],
          procedureType: regular,
          statusChanges: statusHistory([[oneMinuteBefore, closed]]),
        },
        {
          // closed one minute after the fiscal year starts (October 1, Eastern)
          docketNumber: docketNumbers[2],
          procedureType: regular,
          statusChanges: statusHistory([[oneMinuteIn, closed]]),
        },
        {
          // Closed then Closed - Dismissed: only the first change counts
          docketNumber: docketNumbers[3],
          procedureType: small,
          statusChanges: statusHistory([
            [fiveDaysIn, closed],
            [fromFiscalStart(6, 'days'), closedDismissed],
          ]),
        },
        {
          // closed long before both timeframes, then changed to On Appeal
          docketNumber: docketNumbers[4],
          procedureType: regular,
          statusChanges: statusHistory([
            [longBefore, closed],
            [fourDaysIn, onAppeal],
          ]),
        },
      ];

      // the changes the dashboard should count, with their month in Eastern time
      const countedChanges: CountedChange[] = [
        {
          date: oneDayIn,
          month: 10,
          procedureType: regular,
          statusGroup: 'closed',
        },
        {
          date: threeDaysIn,
          month: 10,
          procedureType: regular,
          statusGroup: 'closed',
        },
        {
          date: oneMinuteBefore,
          month: 9,
          procedureType: regular,
          statusGroup: 'closed',
        },
        {
          date: oneMinuteIn,
          month: 10,
          procedureType: regular,
          statusGroup: 'closed',
        },
        {
          date: fiveDaysIn,
          month: 10,
          procedureType: small,
          statusGroup: 'closed',
        },
        {
          date: longBefore,
          month: 0,
          procedureType: regular,
          statusGroup: 'closed',
        },
        {
          date: fourDaysIn,
          month: 10,
          procedureType: regular,
          statusGroup: 'onAppeal',
        },
      ];

      cy.task('insertCasesWithStatusHistory', { cases });
      cy.reload();

      cy.wait('@clerkDashboardStats').then(({ response: afterResponse }) => {
        const after = afterResponse!.body;

        expectIncrease(
          'FYTD',
          before.fiscalYearCaseStats,
          after.fiscalYearCaseStats,
          getExpectedIncrease(countedChanges, fiscalYearWindow),
        );
        expectIncrease(
          'YTD',
          before.calendarYearCaseStats,
          after.calendarYearCaseStats,
          getExpectedIncrease(countedChanges, calendarYearWindow),
        );
      });
    });
  });
});
