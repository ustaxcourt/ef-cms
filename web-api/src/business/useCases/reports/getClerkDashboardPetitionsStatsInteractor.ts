import {
  ClerkDashboardPetitionsStats,
  ClerkDashboardPetitionsTabStats,
  Month,
  authorizeClerkDashboard,
  getClerkDashboardYears,
  getMonthOrderCallback,
} from '@web-api/business/useCases/reports/clerkDashboardStats';
import { MONTH_LABELS } from '@shared/business/entities/EntityConstants';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { orderBy } from 'lodash';
import { petitionsDataByYear } from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';

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

  const petitionFullPaperMonths = Array.from(
    { length: MONTH_LABELS.length },
    (_, i) => {
      const row = petitonPaperMonths.find(r => Number(r.month) === i + 1);
      return {
        month: (i + 1) as Month,
        isPaper: row && row.isPaper !== null ? row.isPaper : true,
        total: row ? Number(row.total) : 0,
      };
    },
  );

  const petitionFullElectronicMonths = Array.from(
    { length: MONTH_LABELS.length },
    (_, i) => {
      const row = petitonElectronicMonths.find(r => Number(r.month) === i + 1);
      return {
        month: (i + 1) as Month,
        isPaper: row && row.isPaper !== null ? row.isPaper : false,
        total: row ? Number(row.total) : 0,
      };
    },
  );

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

export const getClerkDashboardPetitionsStatsInteractor = async (
  authorizedUser: UnknownAuthUser,
): Promise<ClerkDashboardPetitionsTabStats> => {
  authorizeClerkDashboard(authorizedUser);

  const { calendarYearTimeframe, fiscalYear, fiscalYearTimeframe, year } =
    getClerkDashboardYears();

  // Promise.all observes every rejection, so none goes unhandled; the pool has one
  // connection, so the queries still run one after another
  const [calendarYearPetitionStats, fiscalYearPetitionStats] =
    await Promise.all([
      getPetitionsDataByYear(
        false,
        calendarYearTimeframe.begin,
        calendarYearTimeframe.end,
      ),
      getPetitionsDataByYear(
        true,
        fiscalYearTimeframe.begin,
        fiscalYearTimeframe.end,
      ),
    ]);

  return {
    year,
    fiscalYear,
    calendarYearPetitionStats,
    fiscalYearPetitionStats,
  };
};
