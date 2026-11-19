import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  createISODateString,
  deconstructDate,
  getJsTimeframeForYear,
} from '@shared/business/utilities/DateHandler';
import { FISCAL_MONTH_PRIORITY } from '@shared/business/entities/EntityConstants';

// shared by the interactors for the clerk of the court dashboard tabs; each tab has
// its own interactor and endpoint, so a tab renders as soon as its own data loads

export enum Month {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

export type ClerkDashboardPetitionsStats = {
  petitionFullPaperMonths: {
    month: Month;
    isPaper: boolean;
    total: number;
  }[];
  petitionFullElectronicMonths: {
    month: Month;
    isPaper: boolean;
    total: number;
  }[];
  petitionsByServiceType: {
    total: number;
    isPaper: boolean;
  }[];
  petitionsByRepresentation: {
    total: number;
    isRepresenting: boolean;
  }[];
};

export type ClerkDashboardProcedureTypeTotal = {
  procedureType: string;
  total: number;
};

export type ClerkDashboardCaseTypeTotal = {
  caseType: string;
  total: number;
};

export type ClerkDashboardMonthTotal = {
  month: Month;
  total: number;
};

export type ClerkDashboardCasesStats = {
  casesClosedByMonth: ClerkDashboardMonthTotal[];
  casesClosedByProcedureType: ClerkDashboardProcedureTypeTotal[];
  casesOnAppealByMonth: ClerkDashboardMonthTotal[];
};

type ClerkDashboardYears = {
  year: string;
  fiscalYear: string;
};

export type ClerkDashboardPetitionsTabStats = ClerkDashboardYears & {
  calendarYearPetitionStats: ClerkDashboardPetitionsStats;
  fiscalYearPetitionStats: ClerkDashboardPetitionsStats;
};

export type ClerkDashboardCasesTabStats = ClerkDashboardYears & {
  openCasesByCaseType: ClerkDashboardCaseTypeTotal[];
  openCasesByProcedureType: ClerkDashboardProcedureTypeTotal[];
  calendarYearCaseStats: ClerkDashboardCasesStats;
  fiscalYearCaseStats: ClerkDashboardCasesStats;
};

export type ClerkDashboardTimeframe = { begin: Date; end: Date };

const FISCAL_YEAR_START_MONTH = Month.October;

type MonthOrderCallback = ({ month }: { month: Month }) => number;

const byCalendarMonth: MonthOrderCallback = ({ month }) => month;

const byFiscalMonth: MonthOrderCallback = ({ month }) =>
  FISCAL_MONTH_PRIORITY[month - 1];

export const getMonthOrderCallback = (isFiscal: boolean): MonthOrderCallback =>
  isFiscal ? byFiscalMonth : byCalendarMonth;

export const authorizeClerkDashboard = (
  authorizedUser: UnknownAuthUser,
): void => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for clerk dashboard stats');
  }
};

/**
 * The current calendar year and fiscal year, and their timeframes.
 * The fiscal year starts on October 1 (Eastern time) and is named for the year it ends.
 */
export const getClerkDashboardYears = (): ClerkDashboardYears & {
  calendarYearTimeframe: ClerkDashboardTimeframe;
  fiscalYearTimeframe: ClerkDashboardTimeframe;
} => {
  const { month, year } = deconstructDate(createISODateString());

  const fiscalYear =
    Number(month) >= FISCAL_YEAR_START_MONTH ? `${Number(year) + 1}` : year;

  return {
    calendarYearTimeframe: getJsTimeframeForYear({ fiscal: false, year }),
    fiscalYear,
    fiscalYearTimeframe: getJsTimeframeForYear({
      fiscal: true,
      year: fiscalYear,
    }),
    year,
  };
};
