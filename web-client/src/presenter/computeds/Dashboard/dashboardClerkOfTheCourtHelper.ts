import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { DashboardClerkOfTheCourtHelper } from '@web-client/presenter/clerkOfCourtDashboardState';
import { sum } from 'lodash';
import { formatPositiveNumber } from '@web-client/business/utilities/formatPositiveNumber';
import {
  FISCAL_MONTH_LABELS,
  GRAPH_COLORS,
  MONTH_LABELS,
} from '@shared/business/entities/EntityConstants';

export const dashboardClerkOfTheCourtHelper = (
  get: Get,
  _applicationContext: ClientApplicationContext,
): DashboardClerkOfTheCourtHelper => {
  const stats = get(state.clerkOfCourtDashboardStats);

  const petitionsByYearIsFiscal = get(
    state.clerkOfCourtDashboardOptions.petitionsByYearIsFiscal,
  );

  const petitionerStats = petitionsByYearIsFiscal
    ? stats.fiscalYearPetitionStats
    : stats.calendarYearPetitionStats;

  const petitionsByMonthAndServiceTypeChartData = [
    {
      color: GRAPH_COLORS.BLUE,
      data: petitionerStats.petitionFullElectronicMonths.map(p => p.total),
      label: 'Electronic',
    },
    {
      color: GRAPH_COLORS.YELLOW,
      data: petitionerStats.petitionFullPaperMonths.map(p => p.total),
      label: 'Paper',
    },
  ];

  const petitionsByServiceTypePieData =
    petitionerStats.petitionsByServiceType.length > 0
      ? petitionerStats.petitionsByServiceType.map(({ isPaper, total }) => ({
          color: isPaper ? GRAPH_COLORS.YELLOW : GRAPH_COLORS.BLUE,
          name: isPaper ? 'Paper' : 'Electronic',
          value: total,
        }))
      : [];

  const petitionsByRepresentationPieData =
    petitionerStats.petitionsByRepresentation.length > 0
      ? petitionerStats.petitionsByRepresentation.map(
          ({ isRepresenting, total }) => ({
            color: isRepresenting ? GRAPH_COLORS.YELLOW : GRAPH_COLORS.BLUE,
            name: isRepresenting ? 'Represented' : 'Pro Se',
            value: total,
          }),
        )
      : [];

  const totalPetitions = sum(
    petitionerStats.petitionsByServiceType.map(p => p.total),
  );

  return {
    petitionsByMonthAndServiceTypeChartData,
    petitionsByRepresentationPieData,
    petitionsByServiceTypePieData,
    totalPetitions: formatPositiveNumber(totalPetitions),
    months: petitionsByYearIsFiscal ? FISCAL_MONTH_LABELS : MONTH_LABELS,
    year: stats.year,
  };
};
