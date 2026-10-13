import {
  caseStatusChangesByYear,
  openCasesByCaseType,
  openCasesByProcedureType,
  petitionsDataByYear,
} from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
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
import { orderBy } from 'lodash';
import {
  CASE_TYPES,
  FISCAL_MONTH_PRIORITY,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';

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

export type ClerkDashboardStats = {
  year: string;
  calendarYearPetitionStats: ClerkDashboardPetitionsStats;
  fiscalYearPetitionStats: ClerkDashboardPetitionsStats;
  openCasesByCaseType: ClerkDashboardCaseTypeTotal[];
  openCasesByProcedureType: ClerkDashboardProcedureTypeTotal[];
  calendarYearCaseStats: ClerkDashboardCasesStats;
  fiscalYearCaseStats: ClerkDashboardCasesStats;
};

const getMonthOrderCallback = (isFiscal: boolean) =>
  isFiscal
    ? ({ month }: { month: Month }) => FISCAL_MONTH_PRIORITY[month - 1]
    : ({ month }: { month: Month }) => month;

const toProcedureTypeTotals = (
  rows: { procedureType: string | null; total: number | string }[],
): ClerkDashboardProcedureTypeTotal[] =>
  Object.values(PROCEDURE_TYPES_MAP).map(procedureType => ({
    procedureType,
    total: Number(
      rows.find(row => row.procedureType === procedureType)?.total ?? 0,
    ),
  }));

const getOpenCasesByProcedureType = async (): Promise<
  ClerkDashboardProcedureTypeTotal[]
> => {
  const openCases = await openCasesByProcedureType();
  return toProcedureTypeTotals(openCases);
};

const getOpenCasesByCaseType = async (): Promise<
  ClerkDashboardCaseTypeTotal[]
> => {
  const openCases = await openCasesByCaseType();
  return CASE_TYPES.map(caseType => ({
    caseType,
    total: Number(openCases.find(row => row.caseType === caseType)?.total ?? 0),
  }));
};

const getCasesDataByYear = async (
  isFiscal: boolean,
  yearStart: Date,
  yearEnd: Date,
): Promise<ClerkDashboardCasesStats> => {
  const statusChanges = await caseStatusChangesByYear(yearStart, yearEnd);

  const getFullMonths = (
    statusGroup: 'closed' | 'onAppeal',
  ): ClerkDashboardMonthTotal[] => {
    const monthRows = statusChanges.filter(
      row => row.statusGroup === statusGroup && row.month,
    );
    const fullMonths = Array.from({ length: 12 }, (_, i) => {
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

const getPetitionsDataByYear = async (
  isFiscal: boolean,
  yearStart: Date,
  yearEnd: Date,
): Promise<ClerkDashboardPetitionsStats> => {
  const petitionData = await petitionsDataByYear(yearStart, yearEnd);

  const petitonPaperMonths = petitionData.filter(
    pet => pet.isPaper && pet.month,
  );
  const petitonElectronicMonths = petitionData.filter(
    pet => !pet.isPaper && pet.isPaper != null && pet.month,
  );

  const petitionFullPaperMonths = Array.from({ length: 12 }, (_, i) => {
    const row = petitonPaperMonths.find(r => Number(r.month) === i + 1);
    return {
      month: (i + 1) as Month,
      isPaper: row && row.isPaper !== null ? row.isPaper : true,
      total: row ? Number(row.total) : 0,
    };
  });

  const petitionFullElectronicMonths = Array.from({ length: 12 }, (_, i) => {
    const row = petitonElectronicMonths.find(r => Number(r.month) === i + 1);
    return {
      month: (i + 1) as Month,
      isPaper: row && row.isPaper !== null ? row.isPaper : false,
      total: row ? Number(row.total) : 0,
    };
  });

  const petitionsByServiceType = petitionData
    .filter(pet => pet.isPaper != null && !pet.month)
    .map(pet => ({ total: Number(pet.total), isPaper: !!pet.isPaper }));

  const petitionsByRepresentation = petitionData
    .filter(pet => pet.isRepresenting != null)
    .map(pet => ({
      total: Number(pet.total),
      isRepresenting: !!pet.isRepresenting,
    }));

  const orderCallback = getMonthOrderCallback(isFiscal);

  return {
    petitionFullPaperMonths: orderBy(petitionFullPaperMonths, orderCallback),
    petitionFullElectronicMonths: orderBy(
      petitionFullElectronicMonths,
      orderCallback,
    ),
    petitionsByServiceType,
    petitionsByRepresentation,
  };
};

export const getClerkDashboardStatsInteractor = async (
  authorizedUser: UnknownAuthUser,
): Promise<ClerkDashboardStats> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for clerk dashboard stats');
  }

  const { year } = deconstructDate(createISODateString());

  const { begin: calendarYearbegin, end: calendarYearEnd } =
    getJsTimeframeForYear({
      fiscal: false,
      year,
    });

  const { begin: fiscalYearBegin, end: fiscalYearEnd } = getJsTimeframeForYear({
    fiscal: true,
    year,
  });

  const calendarYearPetitionStats = getPetitionsDataByYear(
    false,
    calendarYearbegin,
    calendarYearEnd,
  );

  const fiscalYearPetitionStats = getPetitionsDataByYear(
    true,
    fiscalYearBegin,
    fiscalYearEnd,
  );

  const openCasesByType = getOpenCasesByCaseType();
  const openCases = getOpenCasesByProcedureType();

  const calendarYearCaseStats = getCasesDataByYear(
    false,
    calendarYearbegin,
    calendarYearEnd,
  );

  const fiscalYearCaseStats = getCasesDataByYear(
    true,
    fiscalYearBegin,
    fiscalYearEnd,
  );

  return {
    year,
    calendarYearPetitionStats: await calendarYearPetitionStats,
    fiscalYearPetitionStats: await fiscalYearPetitionStats,
    openCasesByCaseType: await openCasesByType,
    openCasesByProcedureType: await openCases,
    calendarYearCaseStats: await calendarYearCaseStats,
    fiscalYearCaseStats: await fiscalYearCaseStats,
  };
};
