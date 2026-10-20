import {
  CASE_STATUS_TYPES,
  MONTH_LABELS,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import {
  calculateISODate,
  createISODateString,
  deconstructDate,
  getTimeframeForYear,
  isDateWithinGivenInterval,
} from '@shared/business/utilities/DateHandler';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  loginAsClerkOfCourt,
  loginAsDocketClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';

type CountedChange = {
  date: string;
  month: number;
  procedureType: string;
  statusGroup: 'closed' | 'onAppeal';
};

type StatsWindow = { begin: string; end: string };

type MonthTotal = { month: number; total: number };

type CaseStats = {
  casesClosedByMonth: MonthTotal[];
  casesClosedByProcedureType: { procedureType: string; total: number }[];
  casesOnAppealByMonth: MonthTotal[];
};

type ClerkDashboardStats = {
  calendarYearCaseStats: CaseStats;
  fiscalYear: string;
  fiscalYearCaseStats: CaseStats;
  year: string;
};

const { closed, closedDismissed, generalDocketReadyForTrial, onAppeal } =
  CASE_STATUS_TYPES;
const { regular, small } = PROCEDURE_TYPES_MAP;

// the same Eastern-time windows the API counts in
const getStatsWindows = (stats: ClerkDashboardStats) => ({
  calendarYear: getTimeframeForYear({ fiscal: false, year: stats.year }),
  fiscalYear: getTimeframeForYear({ fiscal: true, year: stats.fiscalYear }),
});

// the month of the date in Eastern time
const getMonth = (isoDate: string) => Number(deconstructDate(isoDate).month);

const getClerkDashboardStats = () => {
  cy.intercept('GET', '**/clerk-dashboard-stats').as('clerkDashboardStats');
  loginAsClerkOfCourt();
  return cy
    .wait('@clerkDashboardStats')
    .then(({ response }) => response!.body as ClerkDashboardStats);
};

const totalFor = <T extends { total: number }>(
  entries: T[],
  match: (entry: T) => boolean,
) => entries.find(match)?.total ?? 0;

// how much each count should grow, from the counted changes that fall in the window
const getExpectedIncrease = (
  countedChanges: CountedChange[],
  { begin, end }: StatsWindow,
) => {
  const inWindow = countedChanges.filter(({ date }) =>
    isDateWithinGivenInterval({
      date,
      intervalEndDate: end,
      intervalStartDate: begin,
    }),
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

  MONTH_LABELS.forEach((_, index) => {
    const month = index + 1;
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
  });
};

const expectIncreaseInBothTimeframes = (
  before: ClerkDashboardStats,
  after: ClerkDashboardStats,
  countedChanges: CountedChange[],
) => {
  const windows = getStatsWindows(before);
  expectIncrease(
    'FYTD',
    before.fiscalYearCaseStats,
    after.fiscalYearCaseStats,
    getExpectedIncrease(countedChanges, windows.fiscalYear),
  );
  expectIncrease(
    'YTD',
    before.calendarYearCaseStats,
    after.calendarYearCaseStats,
    getExpectedIncrease(countedChanges, windows.calendarYear),
  );
};

describe('Clerk of Court Dashboard - case status change counts', () => {
  it('should count each change to Closed or On Appeal made in DAWSON, including when a reopened case closes again', () => {
    const changeStatuses = (docketNumber: string, statuses: string[]) => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      statuses.forEach(status => updateCaseStatus(status));
    };

    getClerkDashboardStats().then(before => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        // closed, reopened, closed again: both closures count
        changeStatuses(docketNumber, [
          closed,
          generalDocketReadyForTrial,
          closed,
        ]);
      });
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Closed then Closed - Dismissed: only the first change counts
        changeStatuses(docketNumber, [closed, closedDismissed]);
      });
      createAndServePaperPetition().then(({ docketNumber }) => {
        // Closed then On Appeal: one closure and one change to On Appeal
        changeStatuses(docketNumber, [closed, onAppeal]);
      });

      getClerkDashboardStats().then(after => {
        // every change above happened now, so each falls in the current month
        const now = createISODateString();
        const change = (statusGroup: CountedChange['statusGroup']) => ({
          date: now,
          month: getMonth(now),
          procedureType: regular,
          statusGroup,
        });

        expectIncreaseInBothTimeframes(before, after, [
          change('closed'),
          change('closed'),
          change('closed'),
          change('closed'),
          change('onAppeal'),
        ]);
      });
    });
  });

  describe('fiscal-year boundary', () => {
    // DAWSON records each status change at the current time, so these cases are written to
    // Postgres directly to place a change on either side of October 1
    const docketNumbers = ['9101-97', '9102-97'];
    const RECEIVED_AT = '1997-06-16T16:00:00.000Z';
    const deleteBoundaryCases = () =>
      cy.task('deleteCasesByDocketNumbers', { docketNumbers });

    before(deleteBoundaryCases);
    after(deleteBoundaryCases);

    it('should count a change one minute before October 1 (Eastern) in the previous fiscal year, and one minute after in the current fiscal year', () => {
      getClerkDashboardStats().then(before => {
        const fiscalYearStart = getStatsWindows(before).fiscalYear.begin;
        const oneMinuteBefore = calculateISODate({
          dateString: fiscalYearStart,
          howMuch: -1,
          units: 'minutes',
        });
        const oneMinuteAfter = calculateISODate({
          dateString: fiscalYearStart,
          howMuch: 1,
          units: 'minutes',
        });
        const closedAt = (docketNumber: string, date: string) => ({
          docketNumber,
          procedureType: regular,
          statusChanges: [
            { date: RECEIVED_AT, updatedCaseStatus: CASE_STATUS_TYPES.new },
            { date, updatedCaseStatus: closed },
          ],
        });

        cy.task('insertCasesWithStatusHistory', {
          cases: [
            closedAt(docketNumbers[0], oneMinuteBefore),
            closedAt(docketNumbers[1], oneMinuteAfter),
          ],
        });

        getClerkDashboardStats().then(after => {
          expectIncreaseInBothTimeframes(before, after, [
            {
              date: oneMinuteBefore,
              month: getMonth(oneMinuteBefore),
              procedureType: regular,
              statusGroup: 'closed',
            },
            {
              date: oneMinuteAfter,
              month: getMonth(oneMinuteAfter),
              procedureType: regular,
              statusGroup: 'closed',
            },
          ]);
        });
      });
    });
  });
});
