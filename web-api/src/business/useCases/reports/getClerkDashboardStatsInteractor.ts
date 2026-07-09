import { petitionsDataByYear } from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
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

export type ClerkDashboardStats = {
  year: string;
  calendarYearPetitionStats: ClerkDashboardPetitionsStats;
  fiscalYearPetitionStats: ClerkDashboardPetitionsStats;
};

const fiscalMonthPriority = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];

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

  const orderCallback = isFiscal
    ? ({ month }) => fiscalMonthPriority[month - 1]
    : ({ month }) => month;

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

  return {
    year,
    calendarYearPetitionStats: await calendarYearPetitionStats,
    fiscalYearPetitionStats: await fiscalYearPetitionStats,
  };
};
