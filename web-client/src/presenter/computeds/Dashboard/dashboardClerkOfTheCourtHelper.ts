import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { ClerkOfCourtDashboardState } from '@web-client/presenter/clerkOfCourtDashboardState';
import { sum } from 'lodash';

const MONTHS = [
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
];

const FISCAL_MONTHS = [
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
];

const COLOR_BLUE = '#005EA2';
const COLOR_YELLOW = '#FFBE2E';

export const dashboardClerkOfTheCourtHelper = (
  get: Get,
  _applicationContext: ClientApplicationContext,
): ClerkOfCourtDashboardState => {
  const stats = get(state.clerkOfCourtDashboardStats);

  const petitionsByYearIsFiscal = get(
    state.clerkOfCourtDashboardOptions.petitionsByYearIsFiscal,
  );

  const petitionerStats = petitionsByYearIsFiscal
    ? stats.fiscalYearPetitionStats
    : stats.calendarYearPetitionStats;

  const petitionsByMonthAndServiceTypeChartData = [
    {
      color: COLOR_BLUE,
      data: petitionerStats.petitionFullElectronicMonths.map(p => p.total),
      label: 'Electronic',
    },
    {
      color: COLOR_YELLOW,
      data: petitionerStats.petitionFullPaperMonths.map(p => p.total),
      label: 'Paper',
    },
  ];

  const petitionsByServiceTypePieData =
    petitionerStats.petitionsByServiceType.length > 0
      ? petitionerStats.petitionsByServiceType.map(({ isPaper, total }) => ({
          color: isPaper ? COLOR_YELLOW : COLOR_BLUE,
          name: isPaper ? 'Paper' : 'Electronic',
          value: total,
        }))
      : [];

  const petitionsByRepresentationPieData =
    petitionerStats.petitionsByRepresentation.length > 0
      ? petitionerStats.petitionsByRepresentation.map(
          ({ isRepresenting, total }) => ({
            color: isRepresenting ? COLOR_YELLOW : COLOR_BLUE,
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
    totalPetitions,
    months: petitionsByYearIsFiscal ? FISCAL_MONTHS : MONTHS,
    year: stats.year,
  };
};
