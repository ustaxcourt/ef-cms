import {
  CASE_TYPES,
  MONTH_LABELS,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import {
  ClerkDashboardCaseTypeTotal,
  ClerkDashboardCasesStats,
  ClerkDashboardCasesTabStats,
  ClerkDashboardMonthTotal,
  ClerkDashboardProcedureTypeTotal,
  Month,
  authorizeClerkDashboard,
  getClerkDashboardYears,
  getMonthOrderCallback,
} from '@web-api/business/useCases/reports/clerkDashboardStats';
import {
  caseStatusChangesByYear,
  openCasesByProcedureTypeAndCaseType,
} from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { orderBy } from 'lodash';

const toProcedureTypeTotals = (
  rows: { procedureType: string | null; total: number | string }[],
): ClerkDashboardProcedureTypeTotal[] =>
  Object.values(PROCEDURE_TYPES_MAP).map(procedureType => ({
    procedureType,
    total: Number(
      rows.find(row => row.procedureType === procedureType)?.total ?? 0,
    ),
  }));

const getOpenCases = async (): Promise<{
  openCasesByCaseType: ClerkDashboardCaseTypeTotal[];
  openCasesByProcedureType: ClerkDashboardProcedureTypeTotal[];
}> => {
  // a procedure type row has a null caseType and a case type row has a null procedureType,
  // so each lookup below only matches the rows for its own grouping
  const openCases = await openCasesByProcedureTypeAndCaseType();
  return {
    openCasesByCaseType: CASE_TYPES.map(caseType => ({
      caseType,
      total: Number(
        openCases.find(row => row.caseType === caseType)?.total ?? 0,
      ),
    })),
    openCasesByProcedureType: toProcedureTypeTotals(openCases),
  };
};

const toCasesStats = (
  isFiscal: boolean,
  statusChangeRows: Awaited<ReturnType<typeof caseStatusChangesByYear>>,
): ClerkDashboardCasesStats => {
  const statusChanges = statusChangeRows.map(row => ({
    ...row,
    total: isFiscal ? row.fiscalYearTotal : row.calendarYearTotal,
  }));

  const getFullMonths = (
    statusGroup: 'closed' | 'onAppeal',
  ): ClerkDashboardMonthTotal[] => {
    const monthRows = statusChanges.filter(
      row => row.statusGroup === statusGroup && row.month,
    );
    const fullMonths = Array.from({ length: MONTH_LABELS.length }, (_, i) => {
      const row = monthRows.find(r => Number(r.month) === i + 1);
      return {
        month: (i + 1) as Month,
        total: row ? Number(row.total) : 0,
      };
    });
    return orderBy(fullMonths, getMonthOrderCallback(isFiscal));
  };

  return {
    casesClosedByMonth: getFullMonths('closed'),
    casesClosedByProcedureType: toProcedureTypeTotals(
      statusChanges.filter(
        row => row.statusGroup === 'closed' && row.procedureType,
      ),
    ),
    casesOnAppealByMonth: getFullMonths('onAppeal'),
  };
};

export const getClerkDashboardCasesStatsInteractor = async (
  authorizedUser: UnknownAuthUser,
): Promise<ClerkDashboardCasesTabStats> => {
  authorizeClerkDashboard(authorizedUser);

  const { calendarYearTimeframe, fiscalYear, fiscalYearTimeframe, year } =
    getClerkDashboardYears();

  // Promise.all observes every rejection, so none goes unhandled; the pool has one
  // connection, so the queries still run one after another
  const [{ openCasesByCaseType, openCasesByProcedureType }, statusChanges] =
    await Promise.all([
      getOpenCases(),
      caseStatusChangesByYear({
        calendarYear: calendarYearTimeframe,
        fiscalYear: fiscalYearTimeframe,
      }),
    ]);

  return {
    year,
    fiscalYear,
    openCasesByCaseType,
    openCasesByProcedureType,
    calendarYearCaseStats: toCasesStats(false, statusChanges),
    fiscalYearCaseStats: toCasesStats(true, statusChanges),
  };
};
